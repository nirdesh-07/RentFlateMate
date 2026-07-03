/**
 * names.js — Realistic Indian first and last name pools for seed generation.
 */

export const MALE_FIRST_NAMES = [
  'Aarav', 'Abhay', 'Abhinav', 'Abhishek', 'Aditya', 'Ajay', 'Akash',
  'Alok', 'Amit', 'Amitesh', 'Amogh', 'Anand', 'Aniket', 'Anil',
  'Anish', 'Ankit', 'Ankush', 'Anuj', 'Arjun', 'Arnav', 'Arpit',
  'Ashish', 'Ashok', 'Avinash', 'Ayush', 'Bhushan', 'Chirag', 'Deep',
  'Deepak', 'Dev', 'Devesh', 'Dhruv', 'Dinesh', 'Gaurav', 'Harsh',
  'Harshit', 'Himanshu', 'Hitesh', 'Ishan', 'Jai', 'Jatin', 'Karan',
  'Kartik', 'Kaustubh', 'Kiran', 'Krish', 'Krishna', 'Kunal', 'Lalit',
  'Lokesh', 'Manish', 'Manoj', 'Meet', 'Mihir', 'Mohit', 'Mukul',
  'Naman', 'Naveen', 'Nikhil', 'Nilesh', 'Niraj', 'Nishant', 'Om',
  'Paras', 'Parth', 'Pawan', 'Pranav', 'Prashant', 'Pratik', 'Raghav',
  'Rahul', 'Raj', 'Rajat', 'Rajesh', 'Rakesh', 'Rohan', 'Rohit',
  'Sachin', 'Sahil', 'Sameer', 'Sanjay', 'Sarthak', 'Shivam', 'Shreyas',
  'Shubham', 'Sourabh', 'Sumit', 'Sunil', 'Suresh', 'Tanmay', 'Tarun',
  'Uday', 'Umesh', 'Vaibhav', 'Vikas', 'Vikram', 'Vinay', 'Vishal',
  'Vivek', 'Yash', 'Yogesh', 'Yuvraj', 'Zaid', 'Zeeshan', 'Sidharth',
  'Siddharth', 'Prateek', 'Aman', 'Aakash', 'Ravi', 'Mayank', 'Tushar',
  'Piyush', 'Punit', 'Sandeep', 'Ritesh', 'Saurabh', 'Gaurav', 'Nitin',
];

export const FEMALE_FIRST_NAMES = [
  'Aakanksha', 'Aanchal', 'Aditi', 'Aishwarya', 'Akanksha', 'Alka',
  'Amrita', 'Ananya', 'Ankita', 'Anushka', 'Aparna', 'Archana',
  'Arti', 'Asmita', 'Avni', 'Bhavna', 'Deepa', 'Deepika', 'Divya',
  'Ekta', 'Garima', 'Gunjan', 'Harshita', 'Heena', 'Ishita',
  'Isha', 'Jyoti', 'Kajal', 'Kanchan', 'Kavita', 'Kavya',
  'Khushboo', 'Komal', 'Kratika', 'Kritika', 'Kumkum', 'Latika',
  'Laxmi', 'Madhuri', 'Mamta', 'Mansi', 'Meera', 'Megha',
  'Monika', 'Mudita', 'Muskan', 'Namrata', 'Nandita', 'Natasha',
  'Neha', 'Nikita', 'Nisha', 'Nishika', 'Pankhi', 'Payal',
  'Pooja', 'Poorvi', 'Prachi', 'Pragya', 'Prerna', 'Preeti',
  'Priya', 'Priyanka', 'Rakhi', 'Rashmi', 'Renu', 'Ritika',
  'Ritu', 'Riya', 'Roshni', 'Rucha', 'Rupali', 'Sakshi',
  'Saloni', 'Samiksha', 'Sandhya', 'Sangita', 'Sanya', 'Sarika',
  'Savita', 'Seema', 'Shikha', 'Shivani', 'Shraddha', 'Shreya',
  'Shruti', 'Simran', 'Sneha', 'Sonia', 'Sonam', 'Stuti',
  'Surbhi', 'Swati', 'Tanisha', 'Tanvi', 'Urvashi', 'Varsha',
  'Vandana', 'Vanya', 'Vidya', 'Vineeta', 'Yasmin', 'Zara',
  'Zoya', 'Tanya', 'Pamela', 'Roshani', 'Shivangi', 'Arti',
];

export const LAST_NAMES = [
  'Agarwal', 'Ahuja', 'Anand', 'Arora', 'Bajaj', 'Bansal', 'Batra',
  'Bhatia', 'Bhatt', 'Bhatnagar', 'Chauhan', 'Chawla', 'Chopra',
  'Choudhary', 'Desai', 'Deshpande', 'Dixit', 'Dubey', 'Dutt',
  'Garg', 'Ghosh', 'Goyal', 'Gupta', 'Iyer', 'Jain', 'Joshi',
  'Kapoor', 'Kapur', 'Kashyap', 'Khanna', 'Kumar', 'Lal', 'Mahajan',
  'Malhotra', 'Mehta', 'Mehra', 'Mishra', 'Modi', 'Mukherji', 'Nair',
  'Narang', 'Negi', 'Pandey', 'Patel', 'Pathak', 'Pillai', 'Prasad',
  'Rajput', 'Rao', 'Rastogi', 'Reddy', 'Sahai', 'Saxena', 'Shah',
  'Sharma', 'Shukla', 'Singh', 'Sinha', 'Srivastava', 'Tiwari',
  'Tripathi', 'Tyagi', 'Upadhyay', 'Varma', 'Verma', 'Yadav', 'Walia',
  'Wadhwa', 'Tandon', 'Sobti', 'Sethi', 'Raju', 'Rawat', 'Puri',
];

/** Generate a full random name for given gender */
export const generateName = (gender, pick) => {
  const firstName = gender === 'male'
    ? pick(MALE_FIRST_NAMES)
    : pick(FEMALE_FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  return `${firstName} ${lastName}`;
};

/** Generate a realistic Indian email from a name */
export const generateEmail = (name, index) => {
  const clean = name.toLowerCase().replace(/\s+/g, '.');
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com'];
  const domain = domains[index % domains.length];
  return `${clean}.${1000 + index}@${domain}`;
};

/** Generate an Indian phone number */
export const generatePhone = (index) => {
  const prefixes = ['98', '97', '96', '95', '94', '93', '91', '89', '88', '87', '86', '85', '84', '83', '82'];
  const prefix = prefixes[index % prefixes.length];
  const suffix = String(10000000 + (index * 7919) % 90000000).slice(0, 8);
  return `+91${prefix}${suffix}`;
};
