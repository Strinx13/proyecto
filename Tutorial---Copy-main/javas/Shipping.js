document.addEventListener('DOMContentLoaded', () => {
    const totalCostElement = document.getElementById('total-cost');
    const addressListElement = document.getElementById('address-list');
    const addAddressButton = document.getElementById('add-address');
    const selectedAddressElement = document.getElementById('selected-address');

    // Example total cost
    const totalCost = 99.99;  // Replace with dynamic cost if needed
    totalCostElement.textContent = `$${totalCost.toFixed(2)}`;

    // Retrieve addresses from local storage or use an empty array if not present
    const getAddresses = () => {
        const storedAddresses = localStorage.getItem('addresses');
        return storedAddresses ? JSON.parse(storedAddresses) : [];
    };

    const saveAddresses = (addresses) => {
        localStorage.setItem('addresses', JSON.stringify(addresses));
    };

    let addresses = getAddresses();

    // Function to render address list
    function renderAddressList() {
        addressListElement.innerHTML = addresses.map(address => `
            <div class="address-item" data-id="${address.id}" onclick="selectAddress(${address.id})">
                ${address.address}
            </div>
        `).join('');
    }

    // Function to select an address
    window.selectAddress = function(addressId) {
        const selectedAddress = addresses.find(address => address.id === addressId);
        if (selectedAddress) {
            selectedAddressElement.innerHTML = `<h2>Selected Address</h2><p>${selectedAddress.address}</p>`;
            document.querySelectorAll('.address-item').forEach(item => item.classList.remove('selected'));
            document.querySelector(`.address-item[data-id="${addressId}"]`).classList.add('selected');
        }
    };

    // Function to add a new address
    function addNewAddress() {
        Swal.fire({
            title: 'Add New Address',
            input: 'textarea',
            inputLabel: 'Enter the new address',
            inputPlaceholder: 'Type the address here...',
            inputAttributes: {
                'aria-label': 'Type your address here'
            },
            showCancelButton: true,
            confirmButtonText: 'Add Address',
            cancelButtonText: 'Cancel',
            preConfirm: (newAddress) => {
                if (!newAddress) {
                    Swal.showValidationMessage('Please enter an address');
                }
                return newAddress;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const newAddress = result.value;
                const newId = addresses.length ? Math.max(...addresses.map(addr => addr.id)) + 1 : 1;
                addresses.push({ id: newId, address: newAddress });
                saveAddresses(addresses);  // Save to local storage
                renderAddressList();
                Swal.fire('Added!', 'Your address has been added.', 'success');
            }
        });
    }

    // Initial render
    renderAddressList();

    // Add address button event
    addAddressButton.addEventListener('click', addNewAddress);
});
