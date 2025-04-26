import xlsx from 'xlsx';
import fs from 'fs';
import {
  mode1_CreateNewCompanies,
  mode2_CreateOrUpdateWithoutOverwrite,
  mode3_CreateOrUpdateWithOverwrite,
  mode4_UpdateExistingWithoutOverwrite,
  mode5_UpdateExistingWithOverwrite,
} from '../utils/importModes.js';

export const uploadCompanies = async (req, res) => {
  const file = req.file;
  const mode = req.body.mode;

  if (!file) return res.status(400).json({ message: 'No file uploaded' });
  if (!mode) return res.status(400).json({ message: 'No mode selected' });

  let sheetData = [];
  try {
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
  } catch (err) {
    fs.unlinkSync(file.path);
    return res.status(500).json({ message: 'Error parsing file', error: err.message });
  }

  let result;
  switch (mode) {
    case 'mode1': result = await mode1_CreateNewCompanies(sheetData); break;
    case 'mode2': result = await mode2_CreateOrUpdateWithoutOverwrite(sheetData); break;
    case 'mode3': result = await mode3_CreateOrUpdateWithOverwrite(sheetData); break;
    case 'mode4': result = await mode4_UpdateExistingWithoutOverwrite(sheetData); break;
    case 'mode5': result = await mode5_UpdateExistingWithOverwrite(sheetData); break;
    default:
      fs.unlinkSync(file.path);
      return res.status(400).json({ message: 'Invalid mode selected' });
  }

  // Clean up uploaded file
  fs.unlinkSync(file.path);

  // Send unified response
  return res.status(200).json({
    status: 'success',
    mode,
    inserted: result.inserted || 0,
    updated: result.updated || 0,
    skipped: result.skippedRows.length,
    skippedRows: result.skippedRows,
  });
};