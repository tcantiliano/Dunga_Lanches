document.addEventListener('DOMContentLoaded', () => {
    // 1. Definição de constantes e dados do menu
    const WHATSAPP_NUMBER = "5511982787268";

    const menuData = {
        'beirutes': [
            {
                "Nome": "Frango - Grande",
                "Ingredientes": "mussarela, maionese, alface, tomate e orégano",
                "Valor": "R$ 54,90"
            },
            {
                "Nome": "Frango - Pequeno",
                "Ingredientes": "mussarela, maionese, alface, tomate e orégano",
                "Valor": "R$ 41,00"
            },
            {
                "Nome": "Carne - Grande",
                "Ingredientes": "mussarela, maionese, alface, tomate e orégano",
                "Valor": "R$ 68,90"
            },
            {
                "Nome": "Carne - Pequeno",
                "Ingredientes": "mussarela, maionese, alface, tomate e orégano",
                "Valor": "R$ 51,90"
            },
            {
                "Nome": "Calabresa - Grande",
                "Ingredientes": "mussarela, maionese, alface, tomate e orégano",
                "Valor": "R$ 64,90"
            },
            {
                "Nome": "Calabresa - Pequeno",
                "Ingredientes": "mussarela, maionese, alface, tomate e orégano",
                "Valor": "R$ 48,90"
            },
            {
                "Nome": "Peito de Peru - Grande",
                "Ingredientes": "mussarela, maionese, alface, tomate e orégano",
                "Valor": "R$ 65,90"
            },
            {
                "Nome": "Peito de Peru - Pequeno",
                "Ingredientes": "mussarela, maionese, alface, tomate e orégano",
                "Valor": "R$ 49,90"
            },
            {
                "Nome": "Portuguesa - Grande",
                "Ingredientes": "mussarela, presunto, cebola, ovo, maionese, alface, tomate e orégano",
                "Valor": "R$ 51,90"
            },
            {
                "Nome": "Portuguesa - Pequeno",
                "Ingredientes": "mussarela, presunto, cebola, ovo, maionese, alface, tomate e orégano",
                "Valor": "R$ 39,90"
            }
        ],
        'porcoes': [
            {
                "Nome": "Frango a Passarinho com Fritas - Grande",
                "Ingredientes": "frango temperado é empadano na hora acompanhado de fritas",
                "Valor": "R$ 54,90"
            },
            {
                "Nome": "Frango a Passarinho com Fritas - Pequena",
                "Ingredientes": "frango temperado é empadano na hora acompanhado de fritas",
                "Valor": "R$ 34,90"
            },
            {
                "Nome": "Frango a Passarinho com Fritas Cheddar e Bacon - Grande",
                "Ingredientes": "frango temperado é empadano na hora acompanhado de fritas, cheddar e bacon",
                "Valor": "R$ 64,90"
            },
            {
                "Nome": "Frango a Passarinho com Fritas Cheddar e Bacon - Pequena",
                "Ingredientes": "frango temperado é empadano na hora acompanhado de fritas, cheddar e bacon",
                "Valor": "R$ 44,90"
            },
            {
                "Nome": "Frango a Passarinho com Fritas e Mandioca - Grande",
                "Ingredientes": "frango temperado é empadano na hora acompanhado de fritas e mandioca",
                "Valor": "R$ 67,90"
            },
            {
                "Nome": "Frango a Passarinho com Fritas e Mandioca - Pequena",
                "Ingredientes": "frango temperado é empadano na hora acompanhado de fritas, mandioca, cheddar e bacon",
                "Valor": "R$ 39,90"
            },
            {
                "Nome": "Frango a Passarinho com Fritas e Mandioca Cheddar e Bacon - Grande",
                "Ingredientes": "frango temperado é empadano na hora acompanhado de fritas e mandioca",
                "Valor": "R$ 81,90"
            },
            {
                "Nome": "Frango a Passarinho com Fritas e Mandioca Cheddar e Bacon - Pequena",
                "Ingredientes": "frango temperado é empadano na hora acompanhado de fritas, mandioca, cheddar e bacon",
                "Valor": "R$ 49,90"
            },
            {
                "Nome": "Carne Seca Acebolada com Mandioca",
                "Ingredientes": "carne seca, cebola e mandioca",
                "Valor": "R$ 67,90"
            },
            {
                "Nome": "Carne Seca Acebolada com Mandioca e Queijo Coalho",
                "Ingredientes": "carne seca, cebola, mandioca e queijo coalho",
                "Valor": "R$ 84,90"
            },
            {
                "Nome": "Porção de Fritas - Grande",
                "Ingredientes": "batata frita na caixa de brotinho",
                "Valor": "R$ 28,90"
            },
            {
                "Nome": "Porção de Fritas - Pequena",
                "Ingredientes": "batata frita, cheddar e bacon",
                "Valor": "R$ 14,90"
            },
            {
                "Nome": "Porção de Fritas com Cheddar e Bacon - Grande",
                "Ingredientes": "batata frita na caixa de brotinho",
                "Valor": "R$ 38,90"
            },
            {
                "Nome": "Porção de Fritas com Cheddar e Bacon - Pequena",
                "Ingredientes": "batata frita, cheddar e bacon",
                "Valor": "R$ 21,90"
            },
            {
                "Nome": "Isca de Peixe - Grande",
                "Ingredientes": "isca de peixe",
                "Valor": "R$ 54,90"
            }
        ],
        'pizzas': [
            {
                "Nome": "Calabresa",
                "Ingredientes": "mussarela e cebola",
                "Valor": "R$ 39,90"
            },
            {
                "Nome": "Mussarela",
                "Ingredientes": "mussarela, orégano e azeitona",
                "Valor": "R$ 38,90"
            },
            {
                "Nome": "Toscana",
                "Ingredientes": "calabresa, mussarela, cebola e azeitona",
                "Valor": "R$ 46,90"
            },
            {
                "Nome": "Brócolis",
                "Ingredientes": "mussarela, alho e azeitona",
                "Valor": "R$ 41,90"
            },
            {
                "Nome": "Palmito",
                "Ingredientes": "mussarela, catupiry e azeitona",
                "Valor": "R$ 48,90"
            },
            {
                "Nome": "Atum",
                "Ingredientes": "cebola ou com mussarela, azeitona",
                "Valor": "R$ 49,90"
            },
            {
                "Nome": "Bauru",
                "Ingredientes": "tomate, mussarela e azeitona",
                "Valor": "R$ 41,90"
            },
            {
                "Nome": "Escarola",
                "Ingredientes": "bacon, mussarela e azeitona",
                "Valor": "R$ 41,90"
            },
            {
                "Nome": "Bacon",
                "Ingredientes": "mussarela e azeitona",
                "Valor": "R$ 49,90"
            },
            {
                "Nome": "Baiana",
                "Ingredientes": "calabresa moida, pimenta, mussarela e azeitona",
                "Valor": "R$ 41,90"
            },
            {
                "Nome": "Dois Queijos",
                "Ingredientes": "mussarela, catupiry, tomate e azeitona",
                "Valor": "R$ 46,90"
            },
            {
                "Nome": "Três Queijos",
                "Ingredientes": "mussarela, provolone, parmesão e azeitona",
                "Valor": "R$ 50,90"
            },
            {
                "Nome": "Quatro Queijos",
                "Ingredientes": "mussarela, gorgonzola, provolone, parmesão e azeitona",
                "Valor": "R$ 51,90"
            },
            {
                "Nome": "Napolitana",
                "Ingredientes": "mussarela, tomate e azeitona",
                "Valor": "R$ 41,90"
            },
            {
                "Nome": "Portuguesa",
                "Ingredientes": "mussarela, presunto, ovo, cebola e azeitona",
                "Valor": "R$ 47,90"
            },
            {
                "Nome": "Frango com Catupiry",
                "Ingredientes": "frango ralado, catupiry e azeitona",
                "Valor": "R$ 47,90"
            },
            {
                "Nome": "Lombo",
                "Ingredientes": "mussarela ou catupiry, cebola e azeitona",
                "Valor": "R$ 50,90"
            },
            {
                "Nome": "Carne seca",
                "Ingredientes": "mussarela e azeitona",
                "Valor": "R$ 50,90"
            },
            {
                "Nome": "Alho",
                "Ingredientes": "mussarela, alho e azeitona",
                "Valor": "R$ 41,90"
            }
        ],
        'lanches': [
            {
                "Nome": "X-Frango Grelhado",
                "Ingredientes": "hambúrguer de frango grelhado, queijo, salada e maionese",
                "Valor": "R$ 19,90"
            },
            {
                "Nome": "X-Peito de Peru",
                "Ingredientes": "pão, peito de peru, queijo, salada e maionese",
                "Valor": "R$ 20,90"
            },
            {
                "Nome": "X-Salada",
                "Ingredientes": "hambúrguer, queijo, salada e maionese",
                "Valor": "R$ 16,90"
            },
            {
                "Nome": "X-Bacon",
                "Ingredientes": "hambúrguer, queijo, bacon, salada e maionese",
                "Valor": "R$ 17,90"
            },
            {
                "Nome": "X-Contra File",
                "Ingredientes": "contra filé, queijo, salada e maionese",
                "Valor": "R$ 21,90"
            },
            {
                "Nome": "X-Egg",
                "Ingredientes": "hambúrguer, queijo, ovo, salada e maionese",
                "Valor": "R$ 17,90"
            },
            {
                "Nome": "X-Presunto",
                "Ingredientes": "hambúrguer, queijo, presunto, salada e maionese",
                "Valor": "R$ 18,90"
            },
            {
                "Nome": "Bauru",
                "Ingredientes": "presunto, queijo, tomate e orégano",
                "Valor": "R$ 14,90"
            },
            {
                "Nome": "Misto Quente",
                "Ingredientes": "pão, presunto e queijo",
                "Valor": "R$ 12,90"
            }
        ],
        'bebidas': [
            {
                "Nome": "Refrigerante lata",
                "Ingredientes": "",
                "Valor": "R$ 6,00"
            },
            {
                "Nome": "Suco de Laranja Natural",
                "Ingredientes": "",
                "Valor": "R$ 8,00"
            }
        ]
    };

    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartIconContainer = document.getElementById('cart-icon-container');
    const cartCountSpan = document.getElementById('cart-count');
    const orderForm = document.getElementById('order-form');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalValue = document.getElementById('cart-subtotal-value');
    const freteValue = document.getElementById('frete-value');
    const cartTotalValue = document.getElementById('cart-total-value');
    const freteOptions = document.querySelectorAll('input[name="frete-option"]');
    const customerAddressTextarea = document.getElementById('customer-address');
    const freteMessageDiv = document.getElementById('frete-message');
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const trocoField = document.getElementById('troco-field');
    const trocoValueInput = document.getElementById('troco-value');

    // Altura do cabeçalho para o evento de scroll
    const headerElement = document.querySelector('header');
    let headerHeight = headerElement ? headerElement.offsetHeight : 50;

    // Carrinho global
    let cart = [];

    // --- Funções Auxiliares ---

    /**
     * Converte uma string de valor (ex: "R$ 54,90") para um número float.
     * @param {string} valueString - A string de valor.
     * @returns {number} O valor numérico.
     */
    function parseValue(valueString) {
        const cleanValue = valueString.replace('R$', '').replace(',', '.').trim();
        return parseFloat(cleanValue) || 0;
    }

    /**
     * Salva o estado atual do carrinho no Local Storage.
     */
    function saveCart() {
        localStorage.setItem('dungaLanchesCart', JSON.stringify(cart));
    }

    /**
     * Carrega o carrinho do Local Storage, se existir.
     * @returns {Array} O array de carrinho carregado.
     */
    function loadCart() {
        try {
            const storedCart = localStorage.getItem('dungaLanchesCart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (e) {
            console.error("Falha ao carregar o carrinho do Local Storage:", e);
            return [];
        }
    }

    // --- Funções de Renderização e Lógica do Carrinho ---

    /**
     * Atualiza o contador de itens no ícone do carrinho.
     */
    function updateCartCounter() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    }

    /**
     * Cria e adiciona um item do menu como um card na página.
     * @param {Object} item - Objeto com os dados do item.
     * @param {string} category - A categoria do item.
     */
    function createMenuCard(item, category) {
        const card = document.createElement('div');
        card.className = 'card';
        const nome = item['Nome'] || 'Item sem nome';
        const descricao = item['Ingredientes'] || '';
        const valor = item['Valor'] || 'Preço não disponível';
        card.innerHTML = `
            <h3>${nome}</h3>
            ${descricao ? `<p>${descricao}</p>` : ''}
            <div class="valor">${valor}</div>
            <button class="add-to-cart" data-item-name="${nome}" data-item-price="${valor}">Adicionar ao Carrinho</button>
        `;
        document.getElementById(`${category}-container`).appendChild(card);
    }

    /**
     * Renderiza o menu completo na página.
     */
    function renderMenu() {
        for (const category in menuData) {
            const data = menuData[category];
            const container = document.getElementById(`${category}-container`);
            container.innerHTML = ''; // Limpa o container antes de renderizar
            data.forEach(item => createMenuCard(item, category));
        }
    }

    /**
     * Adiciona um item ao carrinho ou aumenta sua quantidade.
     * @param {Object} itemToAdd - O item a ser adicionado.
     */
    function addItemToCart(itemToAdd) {
        const existingItem = cart.find(cartItem => cartItem.name === itemToAdd.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...itemToAdd, quantity: 1 });
        }
        updateCartDisplay();
        saveCart();
    }

    /**
     * Remove um item completamente do carrinho.
     * @param {string} itemName - O nome do item a ser removido.
     */
    function removeItemFromCart(itemName) {
        cart = cart.filter(cartItem => cartItem.name !== itemName);
        updateCartDisplay();
        saveCart();
    }

    /**
     * Altera a quantidade de um item no carrinho.
     * @param {string} itemName - O nome do item.
     * @param {number} delta - A variação na quantidade (1 para aumentar, -1 para diminuir).
     */
    function changeItemQuantity(itemName, delta) {
        const item = cart.find(cartItem => cartItem.name === itemName);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeItemFromCart(itemName);
            } else {
                updateCartDisplay();
            }
            saveCart();
        }
    }

    /**
     * Renderiza o conteúdo do modal do carrinho.
     */
    function updateCartDisplay() {
        const subtotal = cart.reduce((sum, item) => sum + (parseValue(item.price) * item.quantity), 0);

        // --- Atualização de Totais e Opções de Frete ---
        const selectedFreteOption = document.querySelector('input[name="frete-option"]:checked').value;
        if (selectedFreteOption === 'entrega') {
            freteMessageDiv.textContent = 'A distância máxima é de 5km. O seu endereço será verificado para a confirmação do valor e se estará dentro do nosso alcance, em seguida será enviado o valor do frete.';
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

        // --- Renderização dos Itens do Carrinho ---
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<li>O seu carrinho está vazio.</li>';
        } else {
            cart.forEach(item => {
                const valorNumerico = parseValue(item.price);
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
    }

    // --- Gerenciamento do Pedido e WhatsApp ---

    /**
     * Limpa o carrinho e o formulário de pedido.
     */
    function resetOrder() {
        cart = [];
        orderForm.reset();
        document.querySelector('input[name="frete-option"][value="retirada"]').checked = true;
        document.querySelector('input[name="payment-method"][value="pix"]').checked = true;
        trocoField.classList.add('hidden');
        trocoValueInput.value = '';
        saveCart();
        cartModal.style.display = 'none';
    }

    /**
     * Gera a mensagem do pedido para o WhatsApp e envia.
     * @param {Event} event - O evento de submissão do formulário.
     */
    function handleOrderSubmission(event) {
        event.preventDefault();

        const customerName = document.getElementById('customer-name').value;
        const customerAddress = document.getElementById('customer-address').value;
        const freteOption = document.querySelector('input[name="frete-option"]:checked').value;
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const trocoValue = trocoValueInput.value;

        // Validação básica
        if (cart.length === 0) {
            alert('O seu carrinho está vazio! Adicione itens para continuar.');
            return;
        }

        // Removida a verificação JavaScript do endereço, pois o 'required' do HTML já cuida disso.
        if (!customerName) {
            alert('Por favor, preencha seu nome para o pedido.');
            return;
        }

        let summary = `Olá, gostaria de fazer o seguinte pedido:\n\n`;
        summary += `--- Itens do Pedido ---\n`;
        cart.forEach(item => {
            summary += `- ${item.name} (x${item.quantity}): ${item.price}\n`;
        });

        const subtotal = cart.reduce((sum, item) => sum + (parseValue(item.price) * item.quantity), 0);
        summary += `\nSubtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;

        if (freteOption === 'entrega') {
            summary += `Frete: O valor será verificado.\n`;
        } else {
            summary += `Frete: Grátis (Retirada no Local)\n`;
        }

        summary += `Total: R$ ${subtotal.toFixed(2).replace('.', ',')}\n\n`;

        summary += `--- Dados do Cliente e Pagamento ---\n`;
        summary += `Nome: ${customerName}\n`;
        if (freteOption === 'entrega') {
            summary += `Endereço: ${customerAddress}\n`;
        }

        let paymentMethodText = '';
        if (paymentMethod === 'pix') paymentMethodText = 'Pix';
        else if (paymentMethod === 'cartao') paymentMethodText = 'Cartão de Crédito/Débito';
        else paymentMethodText = `Dinheiro (Troco para R$ ${parseFloat(trocoValue || 0).toFixed(2).replace('.', ',')})`;
        summary += `Pagamento: ${paymentMethodText}\n\n`;

        summary += `Obrigado!`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summary)}`;
        window.open(whatsappUrl, '_blank');

        // Limpa o carrinho após um pequeno atraso para dar tempo ao WhatsApp de abrir
        setTimeout(resetOrder, 1000);
    }

    // --- Inicialização ---

    /**
     * Define todos os listeners de eventos.
     */
    function setupEventListeners() {
        // Evento para adicionar itens ao carrinho
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemName = e.target.dataset.itemName;
                const itemPrice = e.target.dataset.itemPrice;
                addItemToCart({ name: itemName, price: itemPrice });
            });
        });

        // Eventos do Modal
        cartIconContainer.addEventListener('click', () => {
            cartModal.style.display = 'block';
            updateCartDisplay();
        });
        closeButton.addEventListener('click', () => cartModal.style.display = 'none');
        window.addEventListener('click', (event) => {
            if (event.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });

        // Eventos de Opções do Pedido
        freteOptions.forEach(radio => radio.addEventListener('change', updateCartDisplay));
        paymentMethods.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'dinheiro') {
                    trocoField.classList.remove('hidden');
                } else {
                    trocoField.classList.add('hidden');
                }
            });
        });

        // Evento do formulário
        orderForm.addEventListener('submit', handleOrderSubmission);

        // Delegação de eventos para o carrinho (melhor performance)
        cartItemsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return; // Se o clique não foi em um botão
            const itemName = button.dataset.itemName;

            if (button.classList.contains('increase-quantity')) {
                changeItemQuantity(itemName, 1);
            } else if (button.classList.contains('decrease-quantity')) {
                changeItemQuantity(itemName, -1);
            } else if (button.classList.contains('remove-item')) {
                removeItemFromCart(itemName);
            }
        });

        // Efeito de scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > headerHeight) {
                cartIconContainer.classList.add('scrolled');
            } else {
                cartIconContainer.classList.remove('scrolled');
            }
        });
    }

    /**
     * Ponto de entrada da aplicação.
     */
    function init() {
        cart = loadCart();
        renderMenu();
        setupEventListeners();
        updateCartDisplay();
    }

    // Inicia a aplicação
    init();
});