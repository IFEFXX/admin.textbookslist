// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBoEkN4gi9BfxuTS-LEPj-uaWFTtxLP_7o",
  authDomain: "textbookslistsjupeb2024.firebaseapp.com",
  projectId: "textbookslistsjupeb2024",
  storageBucket: "textbookslistsjupeb2024.appspot.com",
  messagingSenderId: "344742576480",
  appId: "1:344742576480:web:af7e6fc00270082fc5de05"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Get reference to the table body
const tbody = document.getElementById('data-body');
const total = document.getElementById('totalr');
// Function to fetch data and populate the table
async function fetchData() {
    try {
        const snapshot = await db.collection("data").get();
        snapshot.forEach(doc => {
            const data = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.name}</td>
                <td>${data.textbooks.join(', ')}</td>
                <td>${data.method}</td>
                <td>${data.amount} Naira</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
}
async function countTotalUsers() {
    try {
      const querySnapshot = await db.collection("reqs").get();
      total.textContent = querySnapshot.size; // Return the size of the query snapshot (total documents)
    } catch (error) {
      console.error("Error counting total users: ", error);
    }
   }

// Call the fetchData function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', fetchData);
