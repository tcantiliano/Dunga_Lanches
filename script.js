document.addEventListener('DOMContentLoaded', () => {
    // Defina o número de telefone do WhatsApp do restaurante
    const WHATSAPP_NUMBER = "5511962339709"; // Exemplo: 5511999999999

    const menuData = {
        'beirutes': [
            { "Nome": "FILÉ DE FRANGO", "Ingredientes": "Filé de frango, queijo, alface e tomate", "Valor": "R$ 25,00" },
            { "Nome": "ROS BIFE", "Ingredientes": "Rosbife, queijo, alface e tomate", "Valor": "R$ 28,00" },
            { "Nome": "AMERICANO", "Ingredientes": "Presunto, queijo, ovo, alface e tomate", "Valor": "R$ 22,00" }
        ],
        'porcoes': [
            { "Nome": "BATATA FRITA", "Valor": "R$ 20,00" },
            { "Nome": "MANDIOCA FRITA", "Valor": "R$ 22,00" },
            { "Nome": "FRANGO A PASSARINHO", "Valor": "R$ 30,00" }
        ],
        'pizzas': [
            { "Sabor": "CALABRESA", "Ingredientes": "Mussarela, calabresa, cebola e azeitonas", "Valor": "R$ 45,00" },
            { "Sabor": "MARGUERITA", "Ingredientes": "Mussarela, tomate e manjericão", "Valor": "R$ 40,00" },
            { "Sabor": "PORTUGUESA", "Ingredientes": "Mussarela, presunto, ovo, ervilha, cebola e azeitonas", "Valor": "R$ 50,00" }
        ],
        'lanches': [
            { "Nome": "X-SALADA", "Descrição": "Hambúrguer, queijo e salada", "Valor": "R$ 15,00" },
            { "Nome": "X-BACON", "Descrição": "Hambúrguer, queijo e bacon", "Valor": "R$ 16,00" },
            { "Nome": "X-EGG", "Descrição": "Hambúrguer, queijo e ovo", "Valor": "R$ 16,00" }
        ]
    };
    
    let cart = [];
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartIcon = document.getElementById('cart-icon-container');
    const orderForm = document.getElementById('order-form');
    
    const cartSubtotalValue = document.getElementById('cart-subtotal-value');
    const freteValue = document.getElementById('frete-value');
    const cartTotalValue = document.getElementById('cart-total-value');
    const freteOptions = document.querySelectorAll('input[name="frete-option"]');
    const customerAddressTextarea = document.getElementById('customer-address');
    const freteMessageDiv = document.getElementById('frete-message');
    
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const trocoField = document.getElementById('troco-field');
    const trocoValueInput = document.getElementById('troco-value');
    const cartItemsContainer = document.getElementById('cart-items');

    function parseValue(valueString) {
        const cleanValue = valueString.replace('R$', '').replace(',', '.').trim();
        return parseFloat(cleanValue) || 0;
    }

    // NOVO: Função para guardar o carrinho no localStorage
    function saveCart() {
        localStorage.setItem('dungaLanchesCart', JSON.stringify(cart));
    }
    
    // NOVO: Função para carregar o carrinho do localStorage
    function loadCart() {
        const storedCart = localStorage.getItem('dungaLanchesCart');
        return storedCart ? JSON.parse(storedCart) : [];
    }

    function createCard(item, category) {
        const card = document.createElement('div');
        card.className = 'card';

        const nome = item['Nome'] || item['Sabor'] || 'Item sem nome';
        const descricao = item['Descrição'] || item['Ingredientes'] || '';
        const valor = item['Valor'] || 'Preço não disponível';
        
        let cardContent = `
            <h3>${nome}</h3>
            ${descricao ? `<p>${descricao}</p>` : ''}
            <div class="valor">${valor}</div>
            <button class="add-to-cart" data-category="${category}" data-item-name="${nome}" data-item-price="${valor}">Adicionar ao Carrinho</button>
        `;
        
        card.innerHTML = cardContent;
        return card;
    }
    
    function updateCartCounter() {
        const cartCountSpan = document.getElementById('cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    }

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        
        let subtotal = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<li>O seu carrinho está vazio.</li>';
        } else {
            cart.forEach(item => {
                const valorNumerico = parseValue(item.price);
                subtotal += valorNumerico * item.quantity;
                
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="item-info">
                        <span>${item.name}</span>
                        <span>R$ ${(valorNumerico * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div class="item-quantity-controls">
                        <button class="decrease-quantity" data-item-name="${item.name}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="increase-quantity" data-item-name="${item.name}">+</button>
                        <button class="remove-item" data-item-name="${item.name}">&times;</button>
                    </div>
                `;
                cartItemsContainer.appendChild(li);
            });
        }
        
        const selectedFreteOption = document.querySelector('input[name="frete-option"]:checked').value;
        if (selectedFreteOption === 'entrega') {
            freteMessageDiv.textContent = 'A distância máxima é de 5km. O seu endereço será verificado dentro de instantes para a confirmação do valor e se estará dentro do nosso alcance, em seguida será enviado o valor do frete.';
            freteMessageDiv.style.display = 'block';
            customerAddressTextarea.required = true;
            freteValue.textContent = 'A verificar...';
        } else {
            freteMessageDiv.style.display = 'none';
            customerAddressTextarea.required = false;
            freteValue.textContent = 'Grátis';
        }

        cartSubtotalValue.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        cartTotalValue.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        
        updateCartCounter();
    }
    
    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.name === item.name);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCartDisplay();
        saveCart(); // NOVO: Salva o carrinho após a alteração
    }
    
    function increaseQuantity(itemName) {
        const item = cart.find(cartItem => cartItem.name === itemName);
        if (item) {
            item.quantity++;
            updateCartDisplay();
            saveCart(); // NOVO: Salva o carrinho
        }
    }
    
    function decreaseQuantity(itemName) {
        const item = cart.find(cartItem => cartItem.name === itemName);
        if (item) {
            item.quantity--;
            if (item.quantity <= 0) {
                removeItem(itemName);
            } else {
                updateCartDisplay();
                saveCart(); // NOVO: Salva o carrinho
            }
        }
    }
    
    function removeItem(itemName) {
        cart = cart.filter(cartItem => cartItem.name !== itemName);
        updateCartDisplay();
        saveCart(); // NOVO: Salva o carrinho
    }

    function clearCart() {
        cart = [];
        orderForm.reset();
        document.querySelector('input[name="frete-option"][value="retirada"]').checked = true;
        document.querySelector('input[name="payment-method"][value="pix"]').checked = true;
        trocoField.classList.add('hidden');
        trocoValueInput.value = '';
        updateCartDisplay();
        saveCart(); // NOVO: Salva o carrinho vazio
        cartModal.style.display = 'none';
    }

    function generateOrderSummary(event) {
        event.preventDefault(); 
        
        const customerName = document.getElementById('customer-name').value;
        const customerAddress = document.getElementById('customer-address').value;
        const freteOption = document.querySelector('input[name="frete-option"]:checked').value;
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const trocoValue = trocoValueInput.value;

        if (cart.length === 0) {
            alert('O seu carrinho está vazio! Adicione alguns itens antes de finalizar.');
            return;
        }
        if (!customerName) {
            alert('Por favor, preencha o seu nome.');
            return;
        }
        if (freteOption === 'entrega' && !customerAddress) {
            alert('Por favor, preencha o seu endereço para a entrega.');
            return;
        }
        if (paymentMethod === 'dinheiro' && trocoValue && parseFloat(trocoValue.replace(',', '.')) < cart.reduce((sum, item) => sum + (parseValue(item.price) * item.quantity), 0)) {
            alert('O valor do troco deve ser maior que o subtotal do pedido.');
            return;
        }

        let subtotal = cart.reduce((sum, item) => sum + (parseValue(item.price) * item.quantity), 0);
        let summary = `Olá, gostaria de fazer o seguinte pedido:\n\n`;
        summary += `--- Itens do Pedido ---\n`;
        cart.forEach(item => {
            summary += `- ${item.name} (x${item.quantity}): ${item.price}\n`;
        });
        summary += `\nSubtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
        
        if (freteOption === 'entrega') {
            summary += `Frete: O valor será verificado após a confirmação do pedido.\n`;
            summary += `Total: R$ ${subtotal.toFixed(2).replace('.', ',')} (O valor do frete será adicionado)\n\n`;
        } else {
            summary += `Frete: Grátis (Retirada no local)\n`;
            summary += `Total: R$ ${subtotal.toFixed(2).replace('.', ',')}\n\n`;
        }

        summary += `--- Pagamento ---\n`;
        let paymentMethodText = '';
        if (paymentMethod === 'pix') {
            paymentMethodText = 'Pix';
        } else if (paymentMethod === 'cartao') {
            paymentMethodText = 'Cartão de Crédito/Débito';
        } else {
            paymentMethodText = `Dinheiro (Troco para R$ ${parseFloat(trocoValue || 0).toFixed(2).replace('.', ',')})`;
        }
        summary += `Forma de Pagamento: ${paymentMethodText}\n\n`;

        summary += `--- Dados do Cliente ---\n`;
        summary += `Nome: ${customerName}\n`;
        if (freteOption === 'entrega') {
            summary += `Endereço: ${customerAddress}\n\n`;
        } else {
            summary += `Opção: Retirada no Local\n\n`;
        }
        summary += `Obrigado!`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summary)}`;
        window.open(whatsappUrl, '_blank');
        
        setTimeout(clearCart, 1000);
    }

    function loadMenu() {
        cart = loadCart(); // NOVO: Carrega o carrinho no início
        
        for (const category in menuData) {
            const data = menuData[category];
            const container = document.getElementById(`${category}-container`);
            
            data.forEach(item => {
                const card = createCard(item, category);
                container.appendChild(card);
            });
        }
        
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemName = e.target.dataset.itemName;
                const itemPrice = e.target.dataset.itemPrice;
                addToCart({ name: itemName, price: itemPrice });
            });
        });
        
        orderForm.addEventListener('submit', generateOrderSummary);

        cartIcon.addEventListener('click', () => {
            cartModal.style.display = 'block';
            updateCartDisplay();
        });

        closeButton.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
        
        freteOptions.forEach(radio => {
            radio.addEventListener('change', updateCartDisplay);
        });

        paymentMethods.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'dinheiro') {
                    trocoField.classList.remove('hidden');
                    trocoValueInput.required = true;
                } else {
                    trocoField.classList.add('hidden');
                    trocoValueInput.required = false;
                }
            });
        });
        
        cartItemsContainer.addEventListener('click', (e) => {
            const button = e.target;
            const itemName = button.dataset.itemName;
            
            if (button.classList.contains('increase-quantity')) {
                increaseQuantity(itemName);
            } else if (button.classList.contains('decrease-quantity')) {
                decreaseQuantity(itemName);
            } else if (button.classList.contains('remove-item')) {
                removeItem(itemName);
            }
        });

        updateCartDisplay();
    }

    loadMenu();
});