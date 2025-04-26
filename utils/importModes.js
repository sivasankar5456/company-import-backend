// utils/importModes.js
import Company from "../models/company.js";

// Mode 1: Create New Companies
export const mode1_CreateNewCompanies = async (data) => {
  let inserted = 0, skippedRows = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const { email, name, industry, location, phone } = row;
    if (!email) {
      skippedRows.push({ row: i + 2, reason: 'Missing email', data: row });
      continue;
    }
    const exists = await Company.findOne({ email });
    if (exists) {
      skippedRows.push({ row: i + 2, reason: 'Email already exists', data: row });
      continue;
    }
    await Company.create({ email, name, industry, location, phone });
    inserted++;
  }
  return { inserted, skippedRows };
};

// Mode 2: Create New and Update Existing (Without Overwrite)
export const mode2_CreateOrUpdateWithoutOverwrite = async (data) => {
  let inserted = 0, updated = 0, skippedRows = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const { email, name, industry, location, phone } = row;
    if (!email) {
      skippedRows.push({ row: i + 2, reason: 'Missing email', data: row });
      continue;
    }
    const comp = await Company.findOne({ email });
    if (!comp) {
      await Company.create({ email, name, industry, location, phone });
      inserted++;
    } else {
      let updates = {};
      if (!comp.name && name) updates.name = name;
      if (!comp.industry && industry) updates.industry = industry;
      if (!comp.location && location) updates.location = location;
      if (!comp.phone && phone) updates.phone = phone;
      if (Object.keys(updates).length) {
        await Company.updateOne({ email }, { $set: updates });
        updated++;
      } else {
        skippedRows.push({ row: i + 2, reason: 'No empty fields to update', data: row });
      }
    }
  }
  return { inserted, updated, skippedRows };
};

// Mode 3: Create New and Update Existing (With Overwrite)
export const mode3_CreateOrUpdateWithOverwrite = async (data) => {
  let inserted = 0, updated = 0, skippedRows = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const { email, name, industry, location, phone } = row;
    if (!email) {
      skippedRows.push({ row: i + 2, reason: 'Missing email', data: row });
      continue;
    }
    const comp = await Company.findOne({ email });
    if (!comp) {
      await Company.create({ email, name, industry, location, phone });
      inserted++;
    } else {
      await Company.updateOne({ email }, { $set: { name, industry, location, phone } });
      updated++;
    }
  }
  return { inserted, updated, skippedRows };
};

// Mode 4: Update Only Existing (Without Overwrite)
export const mode4_UpdateExistingWithoutOverwrite = async (data) => {
  let updated = 0, skippedRows = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const { email, name, industry, location, phone } = row;
    if (!email) {
      skippedRows.push({ row: i + 2, reason: 'Missing email', data: row });
      continue;
    }
    const comp = await Company.findOne({ email });
    if (!comp) {
      skippedRows.push({ row: i + 2, reason: 'Company not found', data: row });
      continue;
    }
    let updates = {};
    if (!comp.name && name) updates.name = name;
    if (!comp.industry && industry) updates.industry = industry;
    if (!comp.location && location) updates.location = location;
    if (!comp.phone && phone) updates.phone = phone;
    if (Object.keys(updates).length) {
      await Company.updateOne({ email }, { $set: updates });
      updated++;
    } else {
      skippedRows.push({ row: i + 2, reason: 'No empty fields to update', data: row });
    }
  }
  return { updated, skippedRows };
};

// Mode 5: Update Only Existing (With Overwrite)
export const mode5_UpdateExistingWithOverwrite = async (data) => {
  let updated = 0, skippedRows = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const { email, name, industry, location, phone } = row;
    if (!email) {
      skippedRows.push({ row: i + 2, reason: 'Missing email', data: row });
      continue;
    }
    const comp = await Company.findOne({ email });
    if (!comp) {
      skippedRows.push({ row: i + 2, reason: 'Company not found', data: row });
      continue;
    }
    await Company.updateOne({ email }, { $set: { name, industry, location, phone } });
    updated++;
  }
  return { updated, skippedRows };
};
