import * as functions from "firebase-functions";
import {
  Contexts,
  dialogflow,
  DialogflowConversation,
} from "actions-on-google";
import * as admin from "firebase-admin";
import { MedicationSchema } from "./schemas/medication.schema";
import { QuestionSchema } from "./schemas/question.schema";
import { MedData, MedKey, MedMap } from "./data/meds.data";

admin.initializeApp();
const db = admin.firestore();
const app = dialogflow({ debug: true });
let questionCount = 0;
let currQuestion = 0;
let expectedAnswer = "";
let follow = "";

app.intent("Add New Prescription", async (conv) => {
  await deleteCollection("medication");
  await deleteCollection("questions");
  questionCount = 0;
  conv.ask('Sure, say "Add Medication" and we will take you to the next step');
});

app.intent("Add Medication", async (conv, params) => {
  const medication: MedicationSchema = {
    medName: params.medName as string,
    // durationAmount: duration.amount,
    // durationUnit: duration.unit,
    aroundMeal: params.aroundMeal as string,
    perDose: params.perDose as string,
    perDay: params.perDay as string,
    doseUnit: params.doseUnit as string,
  };
  await db
    .collection("medication")
    .doc(params.medName as string)
    .set(medication);
  await createQuiz(medication);
  conv.ask(
    `Awesome, you added ${params.medName}, now type \"Add Medication\" to put more in your bucket or type \"Play Quiz\" to enter the Flashcard game`
  );
});

app.intent("Play Quiz", async (conv) => {
  conv.add("There will be 5 questions, good luck!");
  currQuestion = 0;
  await askNextQuestion(conv);
});

async function askNextQuestion(
  conv: DialogflowConversation<unknown, unknown, Contexts>
) {
  let first = "Next up!";
  if (currQuestion >= 5) {
    conv.close("That's all for today, thanks for playing!");
  } else {
    if(currQuestion === 0){
      first = "";
    }
    const min = 0;
    const max = questionCount;

    const random = Math.floor(Math.random() * (max - min) + min);
    const question = (
      await db.collection("questions").doc(`${random}`).get()
    ).data();

    expectedAnswer = question!.expected;
    follow = question!.after;
    conv.ask(first + " " + question!.question);
  }
}

app.intent("Answer", async (conv, params) => {
  const answer = params.key as string;
  if (answer === expectedAnswer) {
    conv.add("correct!\n" + follow);
  } else {
    conv.add(`the correct answer is ${expectedAnswer} \n${follow}`);
  }

  currQuestion++;
  await askNextQuestion(conv);
});

async function createQuiz(medication: MedicationSchema) {
  const medName = medication.medName as MedKey;
  const medData = MedMap[medName] as MedData;
  const medPrescription = (
    await db.collection("medication").doc(medName).get()
  ).data();
  const q1: QuestionSchema = {
    question: `What is the indication of ${medName}?`,
    expected: medData.indicator,
    after: `The indicator of ${medName} is ${medData.indicator}`,
  };

  db.collection("questions")
    .doc(questionCount + "")
    .set(q1);
  questionCount++;

  const q2: QuestionSchema = {
    question: `How many time should you take ${medName} in a day?`,
    expected: medPrescription!.perDay + " " + "times",
    after: `Some information about dosage of  ${medName}: ${medData.overdose}`,
  };

  db.collection("questions")
    .doc(questionCount + "")
    .set(q2);
  questionCount++;

  const q3: QuestionSchema = {
    question: `How much should you take ${medName} in a dose?`,
    expected: medPrescription!.perDose + " " + medPrescription!.doseUnit,
    after: `Some information about dosage of  ${medName}: ${medData.overdose}`,
  };

  db.collection("questions")
    .doc(questionCount + "")
    .set(q3);
  questionCount++;

  const q4: QuestionSchema = {
    question: `What time around a meal should you take ${medName}?`,
    expected: medPrescription!.aroundMeal,
    after: `Some information about using ${medName} with food: ${medData.foodIteraction}`,
  };

  db.collection("questions")
    .doc(questionCount + "")
    .set(q4);
  questionCount++;
}

async function deleteCollection(path: string) {
  await admin
    .firestore()
    .collection(path)
    .listDocuments()
    .then((value) => {
      value.map((value1) => {
        value1.delete();
      });
    });
}

export const fulfillment = functions.https.onRequest(app);
