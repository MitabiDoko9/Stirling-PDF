import samplePdf from "@editor/tests/test-fixtures/sample.pdf?url";
import multiPagePdf from "@editor/tests/test-fixtures/multi-page-sample.pdf?url";
import comparePdfA from "@editor/tests/test-fixtures/compare_sample_a.pdf?url";
import comparePdfB from "@editor/tests/test-fixtures/compare_sample_b.pdf?url";
import formFieldsPdf from "@editor/tests/test-fixtures/form-fields-sample.pdf?url";
import signedPdf from "@editor/tests/test-fixtures/signed-sample.pdf?url";
import encryptedPdf from "@editor/tests/test-fixtures/encrypted.pdf?url";
import scannedPdf from "@editor/tests/test-fixtures/scanned-no-ocr.pdf?url";
import samplePng from "@editor/tests/test-fixtures/sample.png?url";
import sampleJpg from "@editor/tests/test-fixtures/sample.jpg?url";
import sampleDocx from "@editor/tests/test-fixtures/sample.docx?url";
import sampleHtml from "@editor/tests/test-fixtures/sample.html?url";
import validP12 from "@editor/tests/test-fixtures/certs/valid-test.p12?url";
import validJks from "@editor/tests/test-fixtures/certs/valid-test.jks?url";

/**
 * Real files the tool-panel stories load, so a panel reads them exactly as it
 * reads an upload. Names are the file names the panel shows.
 */
export const FIXTURES = {
  "sample.pdf": { url: samplePdf, type: "application/pdf" },
  "multi-page-sample.pdf": { url: multiPagePdf, type: "application/pdf" },
  "compare_sample_a.pdf": { url: comparePdfA, type: "application/pdf" },
  "compare_sample_b.pdf": { url: comparePdfB, type: "application/pdf" },
  "form-fields-sample.pdf": { url: formFieldsPdf, type: "application/pdf" },
  "signed-sample.pdf": { url: signedPdf, type: "application/pdf" },
  "encrypted.pdf": { url: encryptedPdf, type: "application/pdf" },
  "scanned-no-ocr.pdf": { url: scannedPdf, type: "application/pdf" },
  "sample.png": { url: samplePng, type: "image/png" },
  "sample.jpg": { url: sampleJpg, type: "image/jpeg" },
  "sample.docx": {
    url: sampleDocx,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  "sample.html": { url: sampleHtml, type: "text/html" },
  "valid-test.p12": { url: validP12, type: "application/x-pkcs12" },
  "valid-test.jks": { url: validJks, type: "application/octet-stream" },
} as const;

export type FixtureName = keyof typeof FIXTURES;

export async function loadFixture(name: FixtureName): Promise<File> {
  const { url, type } = FIXTURES[name];
  const response = await fetch(url);
  return new File([await response.blob()], name, { type });
}
