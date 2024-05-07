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

// Function to fetch data, remove duplicates, sort alphabetically, and populate the table
async function fetchData() {
    try {
        const snapshot = await db.collection("data").get();
        const uniqueNames = new Set(); // Set to store unique names
        const dataArr = []; // Array to store data objects
        snapshot.forEach(doc => {
            const data = doc.data();
            uniqueNames.add(data.name); // Add unique names to the set
            dataArr.push({ id: doc.id, ...data }); // Push data object with document id to array
        });
        // Sort names alphabetically
        const sortedNames = Array.from(uniqueNames).sort();
        // Clear table body before populating
        tbody.innerHTML = '';
        // Populate table with sorted and unique data
        sortedNames.forEach(name => {
            const userData = dataArr.find(data => data.name === name);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${userData.name}</td>
                <td>${userData.textbooks.join(', ')}</td>
                <td>${userData.method}</td>
                <td>${userData.amount} Naira</td>
                <td>${userData.status ? userData.status : '<button onclick="confirmStatus(\'' + userData.id + '\')">Not Confirmed</button>'}</td>
                <td><button onclick="deleteRow('${userData.id}')">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
        // Calculate total amount
        const totalAmount = dataArr.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
        // Display total amount in label element
        totalLabel.textContent = totalAmount;
        // Display total number of responses
        totalResponsesLabel.textContent = sortedNames.length;
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
}

// Function to delete a row and move it to another collection
async function deleteRow(docId) {
    try {
        // Get document reference
        const docRef = db.collection("data").doc(docId);
        // Get document data
        const docData = (await docRef.get()).data();
        // Add document data to another collection
        await db.collection("deletedData").add(docData);
        // Delete document from original collection
        await docRef.delete();
        // Fetch data again to update table
        fetchData();
    } catch (error) {
        console.error("Error deleting row: ", error);
    }
}

// Function to confirm status
async function confirmStatus(docId) {
    try {
        // Get document reference
        const docRef = db.collection("data").doc(docId);
        // Update status to "Confirmed"
        await docRef.update({ status: "Confirmed" });
        // Fetch data again to update table
        fetchData();
    } catch (error) {
        console.error("Error confirming status: ", error);
    }
}

// Call the fetchData function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', fetchData);
