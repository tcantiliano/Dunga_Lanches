// --- IndexedDB Setup ---
const DB_NAME = 'DungaLanchesDB';
const DB_VERSION = 1; // Increment this version number if you change the database schema
let db; // Global variable to hold the IndexedDB instance

/**
 * Opens the IndexedDB database and creates object stores if they don't exist.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database instance.
 */
function openDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            // Create object store for menu items
            if (!db.objectStoreNames.contains('menuItems')) {
                const menuStore = db.createObjectStore('menuItems', { keyPath: 'id', autoIncrement: true });
                menuStore.createIndex('category', 'category', { unique: false });
                menuStore.createIndex('name', 'name', { unique: false });
                console.log('Object store "menuItems" created.');

                // Populate with initial dummy data if it's a fresh install
                const dummyItems = [
                    { name: 'Hambúrguer Clássico', price: 25.00, description: 'Pão brioche, hambúrguer de carne, queijo cheddar, alface, tomate e molho especial.', category: 'Hambúrgueres' },
                    { name: 'Bacon Explosion', price: 32.00, description: 'Pão australiano, hambúrguer de carne, queijo prato, muito bacon crocante e cebola caramelizada.', category: 'Hambúrgueres' },
                    { name: 'Veggie Power', price: 28.00, description: 'Pão integral, hambúrguer de grão de bico, queijo branco, rúcula e maionese de abacate.', category: 'Hambúrgueres' },
                    { name: 'Refrigerante Lata', price: 7.00, description: 'Coca-Cola, Guaraná, Soda Limonada (350ml).', category: 'Bebidas' },
                    { name: 'Suco Natural', price: 12.00, description: 'Laranja, Abacaxi com Hortelã, Limonada Suíça (500ml).', category: 'Bebidas' },
                    { name: 'Água Mineral', price: 5.00, description: 'Com ou sem gás (500ml).', category: 'Bebidas' },
                    { name: 'Milkshake de Chocolate', price: 18.00, description: 'Sorvete de chocolate, leite e calda de chocolate.', category: 'Sobremesas' },
                    { name: 'Brownie com Sorvete', price: 15.00, description: 'Brownie quentinho com uma bola de sorvete de creme.', category: 'Sobremesas' },
                    { name: 'Pudim de Leite Condensado', price: 10.00, description: 'O clássico que nunca sai de moda, com calda de caramelo.', category: 'Sobremesas' }
                ];

                dummyItems.forEach(item => {
                    menuStore.add(item);
                });
                console.log('Dummy menu items added.');
            }

            // Create object store for finalized orders
            if (!db.objectStoreNames.contains('finalizedOrders')) {
                const ordersStore = db.createObjectStore('finalizedOrders', { keyPath: 'id', autoIncrement: true });
                ordersStore.createIndex('orderDateTime', 'orderDateTime', { unique: false });
                console.log('Object store "finalizedOrders" created.');
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Database opened successfully.');
            resolve(db);
        };

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            showMessage('Erro ao abrir o banco de dados local. Tente novamente.', 'error');
            reject(event.target.error);
        };
    });
}

// --- Global Variables and Element Selection ---
let order = {};
let editingItemId = null;
let allMenuItems = []; // Stores all menu items fetched from IndexedDB
let allFinalizedOrders = []; // Stores all finalized orders fetched from IndexedDB
let isManagementAuthenticated = false; // Flag to track management authentication status
const MANAGEMENT_PASSWORD = "admin123"; // Hardcoded password for management access (for demo purposes)

// Comanda elements
const orderList = document.getElementById('order-list');
const orderTotalSpan = document.getElementById('order-total');
const emptyOrderMessage = document.getElementById('empty-order-message');
const clearOrderButton = document.getElementById('clear-order');
const finalizeOrderButton = document.getElementById('finalize-order');
const sendOrderWhatsappButton = document.getElementById('send-order-whatsapp'); // WhatsApp send button
const customerNameInput = document.getElementById('customer-name');
const customerAddressInput = document.getElementById('customer-address');
const paymentMethodSelect = document.getElementById('payment-method');
const shippingCostDisplay = document.getElementById('shipping-cost-display');
const shippingInput = document.getElementById('shipping-input');

// Menu display elements (client view)
const hamburgueresList = document.getElementById('hamburgueres-list');
const bebidasList = document.getElementById('bebidas-list');
const sobremesasList = document.getElementById('sobremesas-list'); // Corrected ID

// Menu management elements
const addMenuItemForm = document.getElementById('add-menu-item-form');
const itemNameInput = document.getElementById('item-name');
const itemPriceInput = document.getElementById('item-price');
const itemDescriptionInput = document.getElementById('item-description');
const itemCategorySelect = document.getElementById('item-category');
const submitItemButton = document.getElementById('submit-item-button');
const cancelEditButton = document.getElementById('cancel-edit-button');
const managementItemsList = document.getElementById('management-items-list');
const emptyManagementMessage = document.getElementById('empty-management-message');
const searchItemInput = document.getElementById('search-item');

// Main navigation elements
const showMainAppNavButton = document.getElementById('show-main-app-nav');
// const showManagementButton = document.getElementById('show-management'); // REMOVED
const showManagementIconButton = document.getElementById('show-management-icon'); // NEW ICON BUTTON
const showFinalizedOrdersButton = document.getElementById('show-finalized-orders');
const mainAppView = document.getElementById('main-app-view');
const managementView = document.getElementById('management-view');
const finalizedOrdersView = document.getElementById('finalized-orders-view');

// Management password elements
const passwordFormContainer = document.getElementById('password-form-container');
const managementPasswordInput = document.getElementById('management-password');
const submitPasswordButton = document.getElementById('submit-password');
const passwordErrorMessage = document.getElementById('password-error-message');
const managementContent = document.getElementById('management-content'); // Container for actual management content

// Inner navigation elements (Comanda/Cardápio)
const showOrderViewButton = document.getElementById('show-order-view');
const showMenuViewButton = document.getElementById('show-menu-view');
const orderContentView = document.getElementById('order-content-view');
const menuContentView = document.getElementById('menu-content-view'); // Corrected assignment

// Finalized orders display elements
const ordersList = document.getElementById('orders-list');
const emptyOrdersMessage = document.getElementById('empty-orders-message');

// --- Utility Functions ---
function showMessage(message, type = 'info') {
    const msgBox = document.getElementById('message-box');
    msgBox.textContent = message;
    msgBox.classList.remove('bg-blue-500', 'bg-green-500', 'bg-red-500');
    if (type === 'error') {
        msgBox.classList.add('bg-red-500');
    } else if (type === 'success') {
        msgBox.classList.add('bg-green-500');
    } else {
        msgBox.classList.add('bg-blue-500');
    }
    msgBox.style.display = 'block';
    setTimeout(() => {
        msgBox.style.display = 'none';
    }, 3000); // Exibe por 3 segundos para mensagens de sucesso/erro
}

// --- Comanda and Order Logic ---
function updateOrderDisplay() {
    orderList.innerHTML = '';
    let subtotal = 0;
    const currentShippingCost = parseFloat(shippingInput.value) || 0;

    if (Object.keys(order).length === 0) {
        emptyOrderMessage.style.display = 'block';
    } else {
        emptyOrderMessage.style.display = 'none';
        for (const itemName in order) {
            const item = order[itemName];
            const itemElement = document.createElement('div');
            itemElement.classList.add('flex', 'justify-between', 'items-center', 'py-2', 'border-b', 'border-gray-200');
            itemElement.innerHTML = `
                <span class="text-lg text-gray-700">${item.quantity}x ${itemName}</span>
                <div class="flex items-center">
                    <span class="text-lg font-semibold text-gray-800 mr-4">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    <button class="remove-from-order bg-red-400 hover:bg-red-500 text-white text-sm font-bold py-1 px-3 rounded-full transition-colors duration-300" data-name="${itemName}">Remover</button>
                </div>
            `;
            orderList.appendChild(itemElement);
            subtotal += item.price * item.quantity;
        }
    }

    shippingCostDisplay.textContent = `R$ ${currentShippingCost.toFixed(2).replace('.', ',')}`;
    const finalTotal = subtotal + currentShippingCost;
    orderTotalSpan.textContent = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;

    document.querySelectorAll('.remove-from-order').forEach(button => {
        button.removeEventListener('click', handleRemoveItem);
        button.addEventListener('click', handleRemoveItem);
    });
}

function handleAddItem(event) {
    const menuItem = event.target.closest('[data-name]');
    const itemName = menuItem.dataset.name;
    const itemPrice = parseFloat(menuItem.dataset.price);

    if (order[itemName]) {
        order[itemName].quantity++;
    } else {
        order[itemName] = { price: itemPrice, quantity: 1 };
    }
    updateOrderDisplay();
    showMessage(`"${itemName}" adicionado à comanda!`, 'success'); // Show success message
}

function handleRemoveItem(event) {
    const itemName = event.target.dataset.name;
    if (order[itemName]) {
        order[itemName].quantity--;
        if (order[itemName].quantity <= 0) {
            delete order[itemName];
        }
    }
    updateOrderDisplay();
    showMessage(`"${itemName}" removido da comanda.`, 'info'); // Show info message
}

function attachAddButtonListeners() {
    document.querySelectorAll('.add-to-order').forEach(button => {
        button.removeEventListener('click', handleAddItem);
        button.addEventListener('click', handleAddItem);
    });
}

// --- Menu Item Display (Client View) ---
function renderMenuItems(menuData) {
    hamburgueresList.innerHTML = '';
    bebidasList.innerHTML = '';
    sobremesasList.innerHTML = '';

    const categoriesElements = {
        'Hambúrgueres': hamburgueresList,
        'Bebidas': bebidasList,
        'Sobremesas': sobremesasList
    };

    menuData.sort((a, b) => {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });

    menuData.forEach(item => {
        const categoryElement = categoriesElements[item.category];
        if (categoryElement) {
            const itemHtml = `
                <div class="bg-gray-50 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between" data-name="${item.name}" data-price="${item.price}">
                    <div>
                        <h3 class="text-2xl font-semibold text-gray-800 mb-2">${item.name}</h3>
                        <p class="text-gray-600 mb-3">${item.description}</p>
                    </div>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-red-700 font-bold text-xl">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                        <button class="add-to-order bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors duration-300">Adicionar</button>
                    </div>
                </div>
            `;
            categoryElement.insertAdjacentHTML('beforeend', itemHtml);
        }
    });
    attachAddButtonListeners();
}

// --- Menu Item Management (CRUD with IndexedDB) ---
async function fetchMenuItemsFromDb() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized.');
            return;
        }
        const transaction = db.transaction(['menuItems'], 'readonly');
        const store = transaction.objectStore('menuItems');
        const request = store.getAll();

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error('Error fetching menu items from IndexedDB:', event.target.error);
            reject(event.target.error);
        };
    });
}

async function renderManagementItems(menuData) {
    managementItemsList.innerHTML = '';
    const searchTerm = searchItemInput.value.toLowerCase();

    const filteredData = menuData.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );

    if (filteredData.length === 0) {
        emptyManagementMessage.style.display = 'block';
        emptyManagementMessage.textContent = searchTerm ? "Nenhum item encontrado com este termo." : "Nenhum item no cardápio ainda.";
    } else {
        emptyManagementMessage.style.display = 'none';
        filteredData.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('bg-gray-50', 'p-4', 'rounded-lg', 'shadow-md', 'flex', 'flex-col', 'md:flex-row', 'justify-between', 'items-center', 'mb-2');
            itemElement.innerHTML = `
                <div class="flex-grow text-center md:text-left mb-2 md:mb-0">
                    <h4 class="text-xl font-semibold text-gray-800">${item.name}</h4>
                    <p class="text-gray-600 text-sm">${item.category} - R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="flex space-x-2">
                    <button class="edit-item-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-description="${item.description}" data-category="${item.category}">Editar</button>
                    <button class="delete-item-btn bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300" data-id="${item.id}">Remover</button>
                </div>
            `;
            managementItemsList.appendChild(itemElement);
        });

        document.querySelectorAll('.edit-item-btn').forEach(button => {
            button.removeEventListener('click', handleEditItemClick);
            button.addEventListener('click', handleEditItemClick);
        });
        document.querySelectorAll('.delete-item-btn').forEach(button => {
            button.removeEventListener('click', handleDeleteItemClick);
            button.addEventListener('click', handleDeleteItemClick);
        });
    }
}

function handleEditItemClick(event) {
    const button = event.target;
    editingItemId = parseInt(button.dataset.id); // Parse ID as integer for IndexedDB
    itemNameInput.value = button.dataset.name;
    itemPriceInput.value = parseFloat(button.dataset.price);
    itemDescriptionInput.value = button.dataset.description;
    itemCategorySelect.value = button.dataset.category;

    submitItemButton.textContent = "Salvar Alterações";
    submitItemButton.classList.remove('bg-orange-500');
    submitItemButton.classList.add('bg-green-500');
    cancelEditButton.classList.remove('hidden');

    addMenuItemForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function handleDeleteItemClick(event) {
    const itemId = parseInt(event.target.dataset.id); // Parse ID as integer
    try {
        const transaction = db.transaction(['menuItems'], 'readwrite');
        const store = transaction.objectStore('menuItems');
        await store.delete(itemId);
        await transaction.complete; // Wait for the transaction to complete
        showMessage("Item removido com sucesso!", 'success');
        // Re-fetch and render after deletion
        allMenuItems = await fetchMenuItemsFromDb();
        renderMenuItems(allMenuItems);
        renderManagementItems(allMenuItems);
    } catch (e) {
        console.error("Erro ao remover item do IndexedDB: ", e);
        showMessage("Erro ao remover item. Tente novamente.", 'error');
    }
}

cancelEditButton.addEventListener('click', () => {
    editingItemId = null;
    addMenuItemForm.reset();
    submitItemButton.textContent = "Adicionar Item ao Cardápio";
    submitItemButton.classList.remove('bg-green-500');
    submitItemButton.classList.add('bg-orange-500');
    cancelEditButton.classList.add('hidden');
});

if (addMenuItemForm) {
    addMenuItemForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const itemName = itemNameInput.value.trim();
        const itemPrice = parseFloat(itemPriceInput.value);
        const itemDescription = itemDescriptionInput.value.trim();
        const itemCategory = itemCategorySelect.value;

        if (!itemName || isNaN(itemPrice) || !itemDescription || !itemCategory) {
            showMessage("Por favor, preencha todos os campos corretamente.", 'error');
            return;
        }

        try {
            const transaction = db.transaction(['menuItems'], 'readwrite');
            const store = transaction.objectStore('menuItems');
            const itemData = {
                name: itemName,
                price: itemPrice,
                description: itemDescription,
                category: itemCategory,
                createdAt: new Date().toISOString()
            };

            if (editingItemId !== null) {
                // Update existing item
                itemData.id = editingItemId; // Add the ID for update
                itemData.updatedAt = new Date().toISOString();
                await store.put(itemData); // Use put for update
                showMessage("Item atualizado com sucesso!", 'success');
                editingItemId = null;
                submitItemButton.textContent = "Adicionar Item ao Cardápio";
                submitItemButton.classList.remove('bg-green-500');
                submitItemButton.classList.add('bg-orange-500');
                cancelEditButton.classList.add('hidden');
            } else {
                // Add new item
                await store.add(itemData); // Use add for new item
                showMessage("Item adicionado com sucesso!", 'success');
            }
            await transaction.complete; // Wait for the transaction to complete

            addMenuItemForm.reset();
            // Re-fetch and render after add/update
            allMenuItems = await fetchMenuItemsFromDb();
            renderMenuItems(allMenuItems);
            renderManagementItems(allMenuItems);

        } catch (e) {
            console.error("Erro ao salvar item no IndexedDB: ", e);
            showMessage("Erro ao salvar item. Tente novamente.", 'error');
        }
    });
}

searchItemInput.addEventListener('input', () => {
    renderManagementItems(allMenuItems);
});

// --- Finalized Orders Display and Saving ---
async function fetchFinalizedOrdersFromDb() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Database not initialized.');
            return;
        }
        const transaction = db.transaction(['finalizedOrders'], 'readonly');
        const store = transaction.objectStore('finalizedOrders');
        const request = store.getAll();

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error('Error fetching finalized orders from IndexedDB:', event.target.error);
            reject(event.target.error);
        };
    });
}

async function renderFinalizedOrders() {
    ordersList.innerHTML = ''; // Clear current list
    allFinalizedOrders = await fetchFinalizedOrdersFromDb(); // Fetch latest orders

    if (allFinalizedOrders.length === 0) {
        emptyOrdersMessage.style.display = 'block';
    } else {
        emptyOrdersMessage.style.display = 'none';
        // Sort orders by date/time, newest first
        allFinalizedOrders.sort((a, b) => new Date(b.orderDateTime) - new Date(a.orderDateTime));

        allFinalizedOrders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('bg-gray-50', 'p-4', 'rounded-lg', 'shadow-md', 'mb-4');

            let itemsHtml = order.items.map(item =>
                `<li class="text-gray-700">${item.quantity}x ${item.name} (R$ ${item.price.toFixed(2).replace('.', ',')})</li>`
            ).join('');

            orderElement.innerHTML = `
                <h3 class="text-xl font-bold text-emerald-700 mb-2">Pedido #${order.id}</h3>
                <p class="text-gray-600 text-sm mb-2">Data/Hora: ${new Date(order.orderDateTime).toLocaleString('pt-BR')}</p>
                <p class="text-gray-600 mb-1">Cliente: ${order.customerName}</p>
                <p class="text-gray-600 mb-1">Endereço: ${order.customerAddress}</p>
                <p class="text-gray-600 mb-1">Forma de Pagamento: ${order.paymentMethod}</p>
                <p class="text-gray-600 mb-2">Status: <span class="font-semibold text-blue-600">${order.status}</span></p>
                <h4 class="text-lg font-semibold text-gray-800 mt-3 mb-1">Itens:</h4>
                <ul class="list-disc list-inside mb-3">${itemsHtml}</ul>
                <div class="border-t border-gray-200 pt-2 flex justify-between items-center">
                    <span class="text-md font-semibold text-gray-700">Subtotal:</span>
                    <span class="text-md font-bold text-gray-800">R$ ${order.subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-md font-semibold text-gray-700">Frete:</span>
                    <span class="text-md font-bold text-gray-800">R$ ${order.shippingCost.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-xl font-bold text-gray-800">Total:</span>
                    <span class="text-xl font-extrabold text-emerald-700">R$ ${order.total.toFixed(2).replace('.', ',')}</span>
                </div>
            `;
            ordersList.appendChild(orderElement);
        });
    }
}

finalizeOrderButton.addEventListener('click', async () => {
    if (Object.keys(order).length === 0) {
        showMessage('Sua comanda está vazia. Adicione itens antes de finalizar o pedido!', 'info');
        return;
    }

    const customerName = customerNameInput.value.trim();
    const customerAddress = customerAddressInput.value.trim();
    const paymentMethod = paymentMethodSelect.value;
    const currentShippingCost = parseFloat(shippingInput.value) || 0;

    let subtotal = 0;
    const orderItems = [];
    for (const itemName in order) {
        const item = order[itemName];
        orderItems.push({
            name: itemName,
            quantity: item.quantity,
            price: item.price
        });
        subtotal += item.price * item.quantity;
    }

    const finalTotal = subtotal + currentShippingCost;

    const finalizedOrderData = {
        customerName: customerName || 'Não informado',
        customerAddress: customerAddress || 'Não informado',
        items: orderItems,
        subtotal: subtotal,
        shippingCost: currentShippingCost,
        total: finalTotal,
        paymentMethod: paymentMethod,
        orderDateTime: new Date().toISOString(), // Use ISO string for IndexedDB
        status: 'Pendente'
    };

    try {
        if (!db) {
            showMessage("Erro: Banco de dados não inicializado. Tente recarregar a página.", 'error');
            return;
        }
        const transaction = db.transaction(['finalizedOrders'], 'readwrite');
        const store = transaction.objectStore('finalizedOrders');
        await store.add(finalizedOrderData);
        await transaction.complete;
        showMessage("Comanda Feita!", 'success'); // Simplified success message

        order = {};
        customerNameInput.value = '';
        customerAddressInput.value = '';
        paymentMethodSelect.value = 'Dinheiro';
        shippingInput.value = '0.00';
        updateOrderDisplay();
    } catch (e) {
        console.error("Erro ao salvar pedido no IndexedDB: ", e);
        showMessage("Erro ao finalizar pedido. Tente novamente.", 'error');
    }
});

// Function to generate WhatsApp message and open link
function generateWhatsAppLink() {
    if (Object.keys(order).length === 0) {
        showMessage('Sua comanda está vazia. Adicione itens antes de enviar!', 'info');
        return;
    }

    const customerName = customerNameInput.value.trim();
    const customerAddress = customerAddressInput.value.trim();
    const paymentMethod = paymentMethodSelect.value;
    const currentShippingCost = parseFloat(shippingInput.value) || 0;

    let subtotal = 0;
    let message = `*NOVO PEDIDO DUNGA LANCHES!*\n\n`;
    message += `*Cliente:* ${customerName || 'Não informado'}\n`;
    message += `*Endereço:* ${customerAddress || 'Não informado'}\n\n`;
    message += `*Itens do Pedido:*\n`;

    for (const itemName in order) {
        const item = order[itemName];
        message += `- ${item.quantity}x ${itemName} (R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')})\n`;
        subtotal += item.price * item.quantity;
    }

    const finalTotal = subtotal + currentShippingCost;

    message += `\n*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    message += `*Frete:* R$ ${currentShippingCost.toFixed(2).replace('.', ',')}\n`;
    message += `*Total Geral:* R$ ${finalTotal.toFixed(2).replace('.', ',')}\n`;
    message += `*Pagamento:* ${paymentMethod}\n\n`;
    message += `_Pedido gerado em: ${new Date().toLocaleString('pt-BR')}_`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showMessage("Comanda pronta para enviar via WhatsApp!", 'success');
}

shippingInput.addEventListener('input', () => {
    updateOrderDisplay();
});

// --- Navigation Logic ---
// Function to switch between main views (Main App, Management, Finalized Orders)
function switchMainView(viewId) {
    // Hide all main views
    mainAppView.classList.add('hidden');
    managementView.classList.add('hidden');
    finalizedOrdersView.classList.add('hidden');

    // Deactivate all main navigation buttons
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active', 'bg-red-500', 'hover:bg-red-600', 'text-white');
        btn.classList.add('bg-gray-300', 'hover:bg-gray-400', 'text-gray-800');
    });
    document.querySelectorAll('.orders-nav-button').forEach(btn => {
        btn.classList.remove('active', 'bg-emerald-500', 'hover:bg-emerald-600', 'text-white');
        btn.classList.add('bg-gray-300', 'hover:bg-gray-400', 'text-gray-800');
    });
    // Deactivate the new icon button
    showManagementIconButton.classList.remove('bg-red-500', 'hover:bg-red-600', 'text-white');
    showManagementIconButton.classList.add('bg-gray-300', 'hover:bg-gray-400', 'text-gray-800');

    // Handle specific view logic
    if (viewId === 'main-app-view') {
        mainAppView.classList.remove('hidden');
        showMainAppNavButton.classList.add('active', 'bg-red-500', 'hover:bg-red-600', 'text-white');
        switchMainAppSubView('order-content'); // Always show Comanda when returning to main app
        isManagementAuthenticated = false; // Reset management authentication when leaving
    } else if (viewId === 'management-view') {
        managementView.classList.remove('hidden');
        // A cor do ícone muda para indicar que a seção está ativa
        showManagementIconButton.classList.remove('bg-gray-300', 'hover:bg-gray-400', 'text-gray-800');
        showManagementIconButton.classList.add('bg-red-500', 'hover:bg-red-600', 'text-white');
        // Check if already authenticated for management
        if (isManagementAuthenticated) {
            passwordFormContainer.classList.add('hidden');
            managementContent.classList.remove('hidden');
        } else {
            passwordFormContainer.classList.remove('hidden');
            managementContent.classList.add('hidden');
            managementPasswordInput.value = ''; // Clear password field
            passwordErrorMessage.classList.add('hidden'); // Hide error message
        }
    } else if (viewId === 'finalized-orders-view') {
        finalizedOrdersView.classList.remove('hidden');
        showFinalizedOrdersButton.classList.add('active', 'bg-emerald-500', 'hover:bg-emerald-600', 'text-white');
        renderFinalizedOrders(); // Load and display orders when this view is active
        isManagementAuthenticated = false; // Reset management authentication when leaving
    }
}

// Function to switch between sub-views within the main app (Comanda, Cardápio)
function switchMainAppSubView(subViewToShow) {
    // Remove 'active' class from all sub-nav buttons
    document.querySelectorAll('.sub-nav-button').forEach(btn => {
        btn.classList.remove('active', 'bg-green-500', 'hover:bg-green-600', 'text-white');
        btn.classList.add('bg-gray-300', 'hover:bg-gray-400', 'text-gray-800');
    });

    if (subViewToShow === 'order-content') {
        orderContentView.classList.remove('hidden');
        menuContentView.classList.add('hidden');
        showOrderViewButton.classList.add('active', 'bg-green-500', 'hover:bg-green-600', 'text-white');
    } else if (subViewToShow === 'menu-content') {
        orderContentView.classList.add('hidden');
        menuContentView.classList.remove('hidden');
        showMenuViewButton.classList.add('active', 'bg-green-500', 'hover:bg-green-600', 'text-white');
    }
}

// Event listener for password submission
submitPasswordButton.addEventListener('click', () => {
    const enteredPassword = managementPasswordInput.value;
    if (enteredPassword === MANAGEMENT_PASSWORD) {
        isManagementAuthenticated = true;
        passwordFormContainer.classList.add('hidden');
        managementContent.classList.remove('hidden');
        passwordErrorMessage.classList.add('hidden');
        showMessage("Acesso ao gerenciamento concedido!", 'success');
    } else {
        passwordErrorMessage.classList.remove('hidden');
        showMessage("Senha incorreta. Tente novamente.", 'error');
    }
});

// Allow pressing Enter to submit password
managementPasswordInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        submitPasswordButton.click();
    }
});

// Event listeners for main navigation buttons
showMainAppNavButton.addEventListener('click', () => switchMainView('main-app-view'));
// showManagementButton.addEventListener('click', () => switchMainView('management-view')); // REMOVED
showManagementIconButton.addEventListener('click', () => switchMainView('management-view')); // NEW LISTENER
showFinalizedOrdersButton.addEventListener('click', () => switchMainView('finalized-orders-view'));

// Event listeners for inner navigation buttons (Comanda/Cardápio)
showOrderViewButton.addEventListener('click', () => switchMainAppSubView('order-content'));
showMenuViewButton.addEventListener('click', () => switchMainAppSubView('menu-content'));

// Event listener for "Enviar Comanda (WhatsApp)" button
sendOrderWhatsappButton.addEventListener('click', generateWhatsAppLink);

// Event listener for "Limpar Comanda" button
clearOrderButton.addEventListener('click', () => {
    order = {};
    customerNameInput.value = '';
    customerAddressInput.value = '';
    paymentMethodSelect.value = 'Dinheiro';
    shippingInput.value = '0.00';
    updateOrderDisplay();
    showMessage("Comanda limpa!", 'info');
});


// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await openDb(); // Open IndexedDB
        // Initial fetch and render of menu items
        allMenuItems = await fetchMenuItemsFromDb();
        renderMenuItems(allMenuItems);
        renderManagementItems(allMenuItems);

        updateOrderDisplay(); // Initialize order display
        switchMainView('main-app-view'); // Set default view to main app
    } catch (error) {
        console.error("Failed to initialize application:", error);
        showMessage("Erro ao iniciar a aplicação. Verifique o console para mais detalhes.", 'error');
    }
});