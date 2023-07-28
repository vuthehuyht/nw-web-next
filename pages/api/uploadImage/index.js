import fs from "fs";
import formidable from "formidable";
import api from "lib/api";
import { limiter } from "@utils/rateLimit";

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

const createImageObject = (uploadFile, type, userId) => ({
  data: {
    name: uploadFile.name,
    url: uploadFile.url,
    __type: "File",
  },
  createdBy: {
    __type: "Pointer",
    className: "_User",
    objectId: userId,
  },
  type,
});

export default async function handler(req, res) {
  try {
    await limiter.check(res, 60, "CACHE_TOKEN"); // 60 requests per minute

    const form = new formidable.IncomingForm();
    form.uploadDir = "./";
    form.keepExtensions = true;
    const formFields = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ ...files, ...fields });
      });
    });
    const { file = {}, uploadType, userId } = formFields;
    const { path, name, type } = file;
    const binaryFile = await fs.promises.readFile(path);
    fs.unlinkSync(path);

    const uploadFile = await api.post(`/files/${name}.jpeg`, binaryFile, {
      headers: {
        "Content-Type": type,
      },
    });
    const fileObj = await api.post(
      "/classes/Image",
      createImageObject(uploadFile, uploadType, userId)
    );
    res.status(200).json({ ...fileObj, ...uploadFile });
  } catch (error) {
    res.status(500).json({ error, status: "error" });
  }
}
