import { setInterval } from "node:timers/promises";
import { s3Client } from "./s3Client.js";
import { pipeline } from "node:stream/promises";
import { myTransform } from "./myTransform.js";
import { Readable } from "node:stream";
import { randomUUID } from "node:crypto";
import { Upload } from "@aws-sdk/lib-storage";

async function* myReadable() {
  const iterations = 1000;
  let counter = 0;

  for await (const now of setInterval(1)) {
    if (counter === iterations) {
      break;
    }

    counter += 1;

    yield "something";
  }
}

async function uploadS3(stream) {
  const objectKey = `${randomUUID()}.jpeg`;
  const params = {
    Bucket: "test",
    Key: objectKey,
    Body: Readable.from(stream),
  };

  return new Upload({
    client: s3Client,
    params,
  }).done();
}

try {
  await pipeline(myReadable, myTransform(), uploadS3);
} catch (error) {
  console.log("It works!");
  console.log(error);
}
