let jsonData;
let availableFields = [];
let selectedFields = [];

function handleFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                jsonData = JSON.parse(e.target.result);
                updateAvailableFields();
            } catch (error) {
                alert('Invalid JSON file');
            }
        };

        reader.readAsText(file);
    } else {
        alert('Please select a file');
    }
}

function updateAvailableFields() {
    const availableFieldsSelect = document.getElementById('availableFields');
    availableFieldsSelect.innerHTML = '';

    const products = jsonData.products || {};
    for (const key in products) {
        const product = products[key];
        for (const field in product) {
            if (!availableFields.includes(field)) {
                availableFields.push(field);
                const option = document.createElement('option');
                option.value = field;
                option.text = field;
                availableFieldsSelect.add(option);
            }
        }
    }
}

function addSelectedFields() {
    const availableFieldsSelect = document.getElementById('availableFields');
    const selectedFieldsSelect = document.getElementById('selectedFields');

    for (let i = 0; i < availableFieldsSelect.selectedOptions.length; i++) {
        const selectedOption = availableFieldsSelect.selectedOptions[i];
        const index = availableFields.indexOf(selectedOption.value);
        if (index !== -1) {
            availableFields.splice(index, 1);
        }
        selectedFields.push(selectedOption.value);
        selectedFieldsSelect.add(selectedOption);
    }
}

function removeSelectedFields() {
    const availableFieldsSelect = document.getElementById('availableFields');
    const selectedFieldsSelect = document.getElementById('selectedFields');

    for (let i = 0; i < selectedFieldsSelect.selectedOptions.length; i++) {
        const selectedOption = selectedFieldsSelect.selectedOptions[i];
        const index = selectedFields.indexOf(selectedOption.value);
        if (index !== -1) {
            selectedFields.splice(index, 1);
        }
        availableFields.push(selectedOption.value);
        availableFieldsSelect.add(selectedOption);
    }
}

function displayTable() {
    const dataTable = document.getElementById('dataTable');
    dataTable.innerHTML = '';

    if (selectedFields.length === 0) {
        alert('Please select at least one field');
        return;
    }

    // Convert popularity values to integers for proper sorting
    const products = jsonData.products || {};
    const productArray = Object.keys(products).map(key => ({ key, ...products[key] }));

    // Sort the productArray based on popularity in descending order
    const sortedData = productArray.sort((a, b) => {
        return parseInt(b.popularity) - parseInt(a.popularity);
    });

    // Create table header with capitalized and bold attribute names
    const headerRow = dataTable.insertRow();
    selectedFields.forEach((field) => {
        const headerCell = headerRow.insertCell();
        headerCell.innerHTML = capitalizeAndBold(field);
    });

    // Populate table with sorted data
    sortedData.forEach((product) => {
        const dataRow = dataTable.insertRow();
        selectedFields.forEach((field) => {
            const dataCell = dataRow.insertCell();
            dataCell.textContent = product[field];
        });
    });
}


// Function to capitalize the first letter and make the text bold
function capitalizeAndBold(text) {
    return  text.charAt(0).toUpperCase() + text.slice(1) ;
}
