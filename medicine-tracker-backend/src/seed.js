import mongoose from "mongoose";
import dotenv from "dotenv";
import Pharmacy from "./models/pharmacyModel.js";

dotenv.config();

const MEDICINES = [
  "Paracetamol-500mg", "Paracetamol-650mg", "Ibuprofen-400mg", "Aspirin-75mg",
  "Amoxicillin-250mg", "Amoxicillin-500mg", "Azithromycin-500mg", "Ciprofloxacin-500mg",
  "Doxycycline-100mg", "Metronidazole-400mg", "Cefixime-200mg", "Ofloxacin-200mg",
  "Omeprazole-20mg", "Pantoprazole-40mg", "Ranitidine-150mg", "Domperidone-10mg",
  "Ondansetron-4mg", "ORS Sachet", "Loperamide-2mg", "Antacid Gel 200ml",
  "Cetirizine-10mg", "Levocetirizine-5mg", "Montelukast-10mg", "Chlorpheniramine-4mg",
  "Loratadine-10mg", "Salbutamol Inhaler", "Budesonide Inhaler", "Dextromethorphan Syrup",
  "Ambroxol Syrup", "Cough Syrup (Honey Base)",
  "Metformin-500mg", "Metformin-1000mg", "Glimepiride-2mg", "Insulin Glargine",
  "Amlodipine-5mg", "Telmisartan-40mg", "Losartan-50mg", "Atenolol-50mg",
  "Atorvastatin-10mg", "Atorvastatin-20mg", "Rosuvastatin-10mg",
  "Vitamin C-500mg", "Vitamin D3-60K", "Vitamin B12", "Multivitamin Tablets",
  "Calcium + D3 Tablets", "Zinc Sulphate Tablets", "Folic Acid-5mg", "Iron Tablets",
  "Diclofenac Gel", "Diclofenac-50mg", "Tramadol-50mg", "Naproxen-250mg",
  "Hydrocortisone Cream", "Clotrimazole Cream", "Betamethasone Cream", "Mupirocin Ointment",
  "Povidone Iodine Solution", "Hydrogen Peroxide Solution",
  "Metoclopramide-10mg", "Dicyclomine-20mg", "Lactulose Syrup", "Bisacodyl-5mg",
  "Sucralfate Syrup", "Esomeprazole-40mg",
  "Amitriptyline-25mg", "Sertraline-50mg", "Escitalopram-10mg", "Alprazolam-0.25mg",
  "Clonazepam-0.5mg", "Propranolol-40mg",
  "Levothyroxine-50mcg", "Levothyroxine-100mcg",
  "Ranitidine Syrup", "Paracetamol Syrup (Kids)", "Amoxicillin Syrup (Kids)",
  "Multivitamin Syrup (Kids)", "Zinc Syrup (Kids)",
  "Ketoconazole Shampoo", "Permethrin Cream", "Benzoyl Peroxide Gel", "Adapalene Gel",
  "Sunscreen SPF 50", "Calamine Lotion",
  "Aceclofenac-100mg", "Etoricoxib-90mg", "Rabeprazole-20mg", "Domperidone Syrup",
  "Cough Drops (Menthol)", "Throat Lozenges", "Nasal Decongestant Spray", "Saline Nasal Drops",
  "Eye Drops (Lubricant)", "Ciprofloxacin Eye Drops", "Ear Drops (Wax Softener)",
  "Glucose Powder", "Electrolyte Powder", "Antiseptic Liquid", "Cotton Bandage Roll",
  "Surgical Gloves (Pair)", "Digital Thermometer", "N95 Face Mask", "Hand Sanitizer 500ml",
  "Insulin Syringe", "Blood Glucose Test Strips",
];

const AREAS = [
  "Karol Bagh", "Rohini Sector 7", "Dwarka Sector 12", "Saket", "Lajpat Nagar",
  "Connaught Place", "Nehru Place", "Vasant Kunj", "Janakpuri", "Pitampura",
  "Preet Vihar", "Mayur Vihar", "Indirapuram", "Vaishali Ghaziabad", "Sector 18 Noida",
  "Sector 62 Noida", "Sector 14 Gurugram", "Sector 50 Gurugram", "Malviya Nagar",
  "Hauz Khas", "Greater Kailash", "Chandni Chowk", "Paharganj", "Model Town",
  "Shalimar Bagh", "Punjabi Bagh", "Rajouri Garden", "Tilak Nagar", "Uttam Nagar",
  "Kalkaji", "Okhla", "Ashram", "Munirka", "RK Puram", "Vikaspuri", "Shahdara",
  "Yamuna Vihar", "Dilshad Garden", "Patparganj", "Laxmi Nagar",
];

const CHAINS = [
  "Apollo Pharmacy", "MedPlus", "Wellness Forever", "Netmeds Pharmacy",
  "Fortis Pharmacy", "Care Pharmacy", "City Medico", "Jan Aushadhi Kendra",
  "LifeCare Pharmacy", "HealthFirst Chemist", "Sanjeevani Medical Store",
  "Trust Pharmacy", "Metro Medicals", "Sundar Medical Store", "Om Sai Pharmacy",
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];

const pickUniqueMedicines = (count) => {
  const shuffled = [...MEDICINES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((name) => ({
    name,
    quantity: rand(0, 400),
    price: rand(10, 1200),
  }));
};

const generatePharmacy = (index) => {
  const area = pick(AREAS);
  const chain = pick(CHAINS);
  // Delhi-NCR bounding box
  const lat = 28.40 + Math.random() * 0.45;
  const lon = 76.90 + Math.random() * 0.65;

  return {
    name: `${chain} - ${area}`,
    address: `${rand(1, 200)}, ${area}, Delhi NCR`,
    contact: `9${rand(100000000, 999999999)}`,
    location: { lat: Number(lat.toFixed(6)), lon: Number(lon.toFixed(6)) },
    medicines: pickUniqueMedicines(rand(4, 9)),
  };
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding");

    await Pharmacy.deleteMany({});
    console.log("Cleared existing pharmacies");

    const pharmacies = Array.from({ length: 110 }, (_, i) => generatePharmacy(i));
    await Pharmacy.insertMany(pharmacies);

    console.log(`Seeded ${pharmacies.length} pharmacies with ${MEDICINES.length} unique medicines in the pool`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
