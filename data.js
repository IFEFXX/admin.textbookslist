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
        let totalAmount = 0; // Initialize total amount
        const uniqueNames = new Set(); // Set to store unique names
        const rows = []; // Array to store table rows
        snapshot.forEach(doc => {
            const data = doc.data();
            uniqueNames.add(data.name); // Add unique names to the set
            totalAmount += parseFloat(data.amount); // Add amount to total
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.name}</td>
                <td>${data.textbooks.join(', ')}</td>
                <td>${data.method}</td>
                <td>${data.amount} Naira</td>
                <td>${data.status ? data.status : '<button onclick="confirmStatus(\'' + doc.id + '\')">Not Confirmed</button>'}</td>
                <td><button onclick="deleteRow('${doc.id}')">Delete</button></td>
            `;
            rows.push(row); // Push row to the array
        });
        // Sort table rows alphabetically by name
        rows.sort((a, b) => a.children[0].textContent.localeCompare(b.children[0].textContent));
        // Clear the table body
        tbody.innerHTML = '';
        // Append sorted rows to the table body
        rows.forEach(row => {
            tbody.appendChild(row);
        });
        // Display total amount in label element
        totalLabel.textContent = totalAmount;
        // Display total number of responses
        totalResponsesLabel.textContent = uniqueNames.size;
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
}


// Function to generate PDF
function generatePDF() {
    const doc = new jsPDF();
    // Set heading
    doc.setFontSize(20);
    doc.text("Jupeb Textbook Payment List 2023/2024", 20, 20);

    // Convert table to canvas
    html2canvas(document.getElementById("data-table")).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        doc.addImage(imgData, 'PNG', 10, 30, imgWidth, imgHeight);
        doc.save('jupeb_payment_list.pdf');
    });
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
