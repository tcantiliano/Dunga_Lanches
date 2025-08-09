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

    function parseValue(valueString) {
        const cleanValue = valueString.replace('R$', '').replace(',', '.').trim();
        return parseFloat(cleanValue) || 0;
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
        const cartItemsContainer = document.getElementById('cart-items');
        
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
                    <span>${item.name} (x${item.quantity})</span>
                    <span>R$ ${(valorNumerico * item.quantity).toFixed(2).replace('.', ',')}</span>
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
            cartTotalValue.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`; // Total inicial é o subtotal
        } else {
            freteMessageDiv.style.display = 'none';
            customerAddressTextarea.required = false;
            freteValue.textContent = 'Grátis';
            cartTotalValue.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`; // Total é o subtotal
        }

        cartSubtotalValue.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        
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
    }
    
    function clearCart() {
        cart = [];
        orderForm.reset();
        document.querySelector('input[name="frete-option"][value="retirada"]').checked = true;
        updateCartDisplay();
        cartModal.style.display = 'none';
    }

    function generateOrderSummary(event) {
        event.preventDefault(); 
        
        const customerName = document.getElementById('customer-name').value;
        const customerAddress = document.getElementById('customer-address').value;
        const freteOption = document.querySelector('input[name="frete-option"]:checked').value;

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
            summary += `--- Dados do Cliente ---\n`;
            summary += `Nome: ${customerName}\n`;
            summary += `Endereço: ${customerAddress}\n\n`;
            summary += `Obrigado!`;
        } else {
            summary += `Frete: Grátis (Retirada no local)\n`;
            summary += `Total: R$ ${subtotal.toFixed(2).replace('.', ',')}\n\n`;
            summary += `--- Dados do Cliente ---\n`;
            summary += `Nome: ${customerName}\n`;
            summary += `Opção: Retirada no Local\n\n`;
            summary += `Obrigado!`;
        }

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summary)}`;
        window.open(whatsappUrl, '_blank');
        
        setTimeout(clearCart, 1000);
    }

    function loadMenu() {
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

        updateCartDisplay();
    }

    loadMenu();
});