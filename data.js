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

// Get reference to the table body and total label
const tbody = document.getElementById('data-body');
const totalLabel = document.getElementById('total-amount');
const totalResponsesLabel = document.getElementById('totalr');

// Function to fetch data and populate the table
async function fetchData() {
    try {
        const snapshot = await db.collection("data").get();
        const uniqueAmounts = new Set(); // Set to store unique amounts
        snapshot.forEach(doc => {
            const data = doc.data();
            uniqueAmounts.add(parseFloat(data.amount)); // Add unique amounts to the set
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.name}</td>
                <td>${data.textbooks.join(', ')}</td>
                <td>${data.method}</td>
                <td>${data.amount} Naira</td>
            `;
            tbody.appendChild(row);
        });
        // Calculate total amount
        const totalAmount = Array.from(uniqueAmounts).reduce((acc, curr) => acc + curr, 0);
        // Display total amount in label element
        totalLabel.textContent = totalAmount;
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
}

// Function to count total responses
async function countTotalResponses() {
    try {
        const snapshot = await db.collection("data").get();
        totalResponsesLabel.textContent = snapshot.size; // Display total number of documents
    } catch (error) {
        console.error("Error counting total responses: ", error);
    }
}

// Call the fetchData and countTotalResponses functions when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    countTotalResponses();
});
