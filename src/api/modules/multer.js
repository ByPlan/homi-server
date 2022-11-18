import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import path from "path";
import {
  CreateBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fetch from "node-fetch";
import { s3 } from "../../helpers/s3Client.js";

const envFound = dotenv.config({ path: path.resolve("../.env") });
if (envFound.error) {
  const envFound2 = dotenv.config();
  if (envFound2.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}

const uploadPostImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read", // Should change the acl option to "bucket-owner-full-control"
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `Posts/${req.params.postId}/${Date.now()}_${file.originalname}`);
    },
  }),
});

// Set parameters
// Create a random name for the Amazon Simple Storage Service (Amazon S3) bucket and key
const bucketParamsExample = {
  Bucket: `test-bucket-${Math.ceil(Math.random() * 10 ** 10)}`,
  Key: `test-object-${Math.ceil(Math.random() * 10 ** 10)}`,
  Body: "BODY",
};

const getImages = async (key, body) => {
  const bucketParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: body,
  };

  // Create a presigned URL.
  try {
    // Create the command.
    const command = new GetObjectCommand(bucketParams);

    // Create the presigned URL.
    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });
    console.log(signedUrl);
    const response = await fetch(signedUrl);
    console.log(response);
  } catch (err) {
    console.log("Error creating presigned URL", err);
  }
};

// getImages("Posts/1/test_image.jpg", "post");

export { uploadPostImage };

// multer for storing at disk storage
// const storage = multer.diskStorage({
//   destination(req, file, callback) {
//     callback(null, path.resolve("./assets/images"));
//   },
//   filename(req, file, callback) {
//     callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });

// AWS S3 using sdk
// Create an S3 bucket.
// try {
//   console.log(`Creating bucket ${bucketParams.Bucket}`);
//   const data = await s3.send(
//     new CreateBucketCommand({ Bucket: bucketParams.Bucket })
//   );
//   return data; // For unit tests.
//   console.log(`Waiting for "${bucketParams.Bucket}" bucket creation...\n`);
// } catch (err) {
//   console.log("Error creating bucket", err);
// }

// Put the object in the S3 bucket.
// try {
//   console.log(`Putting object "${bucketParams.Key}" in bucket`);
//   const data = await s3.send(
//     new PutObjectCommand({
//       Bucket: bucketParams.Bucket,
//       Key: bucketParams.Key,
//       Body: bucketParams.Body,
//     })
//   );
//   return data; // For unit tests.
// } catch (err) {
//   console.log("Error putting object", err);
// }

// Delete the object.
// try {
//   console.log(`\nDeleting object "${bucketParams.Key}"} from bucket`);
//   const data = await s3.send(
//     new DeleteObjectCommand({
//       Bucket: bucketParams.Bucket,
//       Key: bucketParams.Key,
//     })
//   );
//   return data; // For unit tests.
// } catch (err) {
//   console.log("Error deleting object", err);
// }

// Delete the S3 bucket.
// try {
//   console.log(`\nDeleting bucket ${bucketParams.Bucket}`);
//   const data = await s3.send(
//     new DeleteBucketCommand({
//       Bucket: bucketParams.Bucket,
//       Key: bucketParams.Key,
//     })
//   );
//   return data; // For unit tests.
// } catch (err) {
//   console.log("Error deleting object", err);
// }
