import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roommatch-ai';

async function check() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');

  const db = mongoose.connection.db;

  const docs = await db.collection('seekerprofiles').find({
    $or: [
      { name: /Abhi/i },
      { name: /Prashant/i },
      { name: /Yash/i },
      { name: /Rashika/i }
    ]
  }).toArray();

  console.log(`Found ${docs.length} matching seekers:`);
  docs.forEach(doc => {
    console.log(`- Name: "${doc.name}", City: "${doc.city}", Locality: "${doc.locality}", searchingFor: "${doc.searchingFor}"`);
  });

  await mongoose.disconnect();
}

check().catch(console.error);
