import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export interface EvidenceSaveResult {
  case_id: string;
  description: string;
  filename: string;
  stored_path: string;
  sha256_hash: string;
  server_timestamp: string;
}

export async function saveEvidenceFile(
  caseId: string,
  description: string,
  filename: string,
  content: Buffer
): Promise<EvidenceSaveResult> {
  const safeName = `${caseId}_${Date.now()}_${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = path.join(UPLOAD_DIR, safeName);

  fs.writeFileSync(filePath, content);

  const sha256Hash = crypto.createHash('sha256').update(content).digest('hex');

  return {
    case_id: caseId,
    description: description,
    filename: filename,
    stored_path: filePath,
    sha256_hash: sha256Hash,
    server_timestamp: new Date().toISOString(),
  };
}
