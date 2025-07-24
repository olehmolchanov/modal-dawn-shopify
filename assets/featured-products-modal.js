customElements.define(
  "product-modal",
  class extends HTMLElement {
    constructor() {
      super();
      this.enabled = this.dataset.enabled === "true";
      this.showOnce = this.dataset.showOnce === "true";
      this.products = JSON.parse(this.dataset.products || "[]");
      this.heading = this.dataset.heading;
      this.showMainImage = this.dataset.showMainImage === "true";
      this.attachShadow({ mode: "open" });
      this.render();
    }

    connectedCallback() {
      if (
        !this.enabled ||
        (this.showOnce && localStorage.getItem("modal_shown"))
      )
        return;

      document
        .querySelectorAll('form[action^="/cart/add"] .product-form__submit')
        .forEach((btn) => {
          btn.addEventListener("click", async (e) => {
            const form = e.target.closest("form");
            e.preventDefault();

            const formData = new FormData(form);
            const variantId = formData.get("id");
            const handle = form.dataset.productHandle;

            if (!handle || !variantId) return;

            const product = await fetch(`/products/${handle}.js`)
              .then((res) => (res.ok ? res.json() : null))
              .catch(() => null);

            if (!product) return;

            const variant =
              product.variants.find((v) => v.id == variantId) ||
              product.variants[0];

            this.showModal({
              id: variant.id,
              title: product.title,
              image: product.featured_image,
            });
          });
        });
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
.modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: none;
	justify-content: center;
	align-items: center;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;

	overflow-y: auto;
}
.modal.active {
	display: flex;
}
.modal-content {
	background: white;
	display: flex;
	flex-direction: row;
	padding: 4rem;
	max-width: 91.8rem;
	width: 100%;
	gap: 1rem;
	box-sizing: border-box;

	margin: 1.6rem;

	position: relative;
}
.modal-left {
	max-width: 41.1rem;
	position: relative;
	height: 43.8rem;
	overflow: hidden;
	flex-shrink: 0;
	width: 100%;
}
.modal-left img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.modal-right {
	display: flex;
	flex-direction: column;
	gap: 3.2rem;
	flex: 1;
}
.modal-right__title {
	margin: 0;
	color: #05117f;
	font-size: 2.4rem;
	font-style: normal;
	font-weight: 700;
	line-height: 2.4rem;
	text-transform: uppercase;
}
.modal-right__inner {
	display: flex;
	flex-direction: column;

	gap: 1rem;
}
.modal-right__text {
	margin: 0;
	color: #464646;
	font-size: 1.4rem;
	font-style: normal;
	font-weight: 400;
	line-height: 2rem;
}
.modal-right__text strong {
	font-size: 2rem;
	font-weight: 700;
}
.modal-right__info {
	margin: 0;
	color: #000;

	font-size: 1.4rem;
	font-style: normal;
	font-weight: 400;
	line-height: 2rem;
}
.modal-right__info strong {
	color: #05117f;
	font-size: 1.8rem;
	font-style: normal;
	font-weight: 700;
	line-height: 2.4rem;
}
.modal-right__products {
	display: flex;
	flex-direction: column;

	gap: 2rem;
}
.product-item {
	display: flex;
	gap: 1rem;
	align-items: center;
}
.product-item__image {
	width: 8.8rem;
	height: 10rem;
	flex-shrink: 0;
}
.product-item__image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.product-item__wrapper {
	display: flex;
	flex-direction: column;

	gap: 1.1rem;

	flex: 1;
}
.product-item__title {
	color: #262c3e;

	font-size: 1.4rem;
	font-style: normal;
	font-weight: 700;
	line-height: 2.4rem;
	margin: 0;
}
.product-item__sku {
	color: #666;
	font-size: 1.2rem;
	font-style: normal;
	font-weight: 400;
	line-height: 1.4rem;
}
.product-item__price {
	color: #05117f;
	font-size: 1.8rem;
	font-style: normal;
	font-weight: 700;
	line-height: 2.4rem;
	font-weight: 700;

	display: flex;
	align-items: center;
	gap: 1rem;
}
.product-item__price s {
	font-weight: 400;
	text-decoration-line: line-through;
	color: #666;
}

.modal-right__buttons {
	display: flex;
	align-items: center;
	gap: 1rem;
	flex-shrink: 0;
}

.modal-right__button {
	height: 4.4rem;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;

	background: #05117f;
	color: #fff;
	font-size: 1.6rem;
	font-style: normal;
	font-weight: 700;
	line-height: 2.4rem;

	cursor: pointer;
	padding: 0.6rem 4rem;
	border: 0;
	box-shadow: 0;

	transition: all 0.3s ease;
}
.modal-right__button.modal-right__button--outline {
	border: 0.1rem solid #05117f;
	background: transparent;
	color: #05117f;
	font-weight: 500;
}
.modal-right__button.modal-right__button--outline:hover {
	background: #05117f;
	color: #fff;
	opacity: 100%;
}
.modal-right__button:hover {
	opacity: 80%;
}
.modal__close {
	position: absolute;
	z-index: 10;
	top: 4rem;
	right: 4rem;

	width: 2.4rem;
	height: 2.4rem;

	background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_53_2' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='24' height='24'%3E%3Crect width='24' height='24' fill='%23D9D9D9'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_53_2)'%3E%3Cpath d='M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z' fill='%231C1B1F'/%3E%3C/g%3E%3C/svg%3E%0A");
	background-position: center;
	background-size: contain;
	background-repeat: no-repeat;

	transition: all 0.3s ease;

	cursor: pointer;
}
.modal__close:hover {
	opacity: 70%;
}

@media (max-width: 767.98px) {
	.modal {
		justify-content: stretch;
		align-items: stretch;
	}
	.modal-content {
		flex-direction: column;
		gap: 3.2rem;

		padding: 20px 16px;
		height: max-content;
	}
	.modal-left {
		max-width: 100%;
		align-self: center;
		max-width: 32rem;
		height: 32rem;
	}

	.modal-right {
		gap: 2.4rem;
	}
	.modal-right__buttons {
		flex-direction: column;
		align-items: stretch;
	}
	.modal-right__button {
		width: 100%;
	}
	.modal__close {
		top: 1.6rem;
		right: 1.6rem;
	}
}

        </style>
        <div class="modal">
          <div class="modal-content">
          <div class="modal__close modal-close"></div>
            <div class="modal-left"></div>
            <div class="modal-right product-info">
              <h2 class="modal-right__title">${this.heading}</h2>
             <div class="modal-right__inner">
              <p class="modal-right__text main-product-line"></p>
              <p class="modal-right__info main-product-info"></p>
              </div>
              
              <div class="modal-right__products modal-products"></div>
              <div class="modal-right__buttons btns">
                <button class="modal-right__button add-btn">Add to Cart</button>
                <button class="modal-right__button modal-right__button--outline continue-btn">Continue to the Cart</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    async showModal(mainProduct) {
      const modal = this.shadowRoot.querySelector(".modal");
      const left = this.shadowRoot.querySelector(".modal-left");
      const right = this.shadowRoot.querySelector(".modal-products");
      const line = this.shadowRoot.querySelector(".main-product-line");
      const info = this.shadowRoot.querySelector(".main-product-info");

      line.innerHTML = `You are trying to add <strong>${mainProduct.title}</strong> to the cart.`;

      left.innerHTML =
        this.showMainImage && mainProduct.image
          ? `<img src="${mainProduct.image}" alt="${mainProduct.title}">`
          : "";

      const productsData = (
        await Promise.all(
          this.products.map((p) =>
            fetch(`/products/${p.handle}.js`)
              .then((res) => (res.ok ? res.json() : null))
              .catch(() => null)
          )
        )
      ).filter(Boolean);

      let discount = 0;
      right.innerHTML = productsData
        .map((p, i) => {
          const variantId = this.products[i].variantId;
          const current =
            p.variants.find((v) => v.id === variantId) || p.variants[0];
          if (
            current.compare_at_price &&
            current.compare_at_price > current.price
          ) {
            discount += current.compare_at_price - current.price;
          }
          return `
          <div class="product-item" data-id="${current.id}">
          <div class="product-item__image">
          <img src="${p.featured_image}" alt="${p.title}">
          </div>
            
            <div class="product-item__wrapper">
              <div class="product-item__title">${p.title}</div>
              <div class="product-item__sku">SKU: ${current.sku || "N/A"}</div>
              <div class="product-item__price"><span>$${(
                current.price / 100
              ).toFixed(2)}</span>
              ${
                current.compare_at_price
                  ? `<s>$${(current.compare_at_price / 100).toFixed(2)}</s>`
                  : ""
              }</div>
            </div>
          </div>
        `;
        })
        .join("");

      if (discount > 0) {
        info.innerHTML += ` Complete your look and save <strong>$${(
          discount / 100
        ).toFixed(2)}!</strong>`;
      }

      modal.classList.add("active");

      this.shadowRoot.querySelector(".add-btn").onclick = async () => {
        try {
          await fetch("/cart/add.js", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: parseInt(mainProduct.id), quantity: 1 }),
          });

          const productItems =
            this.shadowRoot.querySelectorAll(".product-item");
          for (const el of productItems) {
            const id = parseInt(el.dataset.id);
            await fetch("/cart/add.js", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, quantity: 1 }),
            });
          }

          modal.classList.remove("active");

          const cartItems =
            document.querySelector("cart-items") ||
            document.querySelector("cart-drawer-items");
          if (cartItems && typeof cartItems.onCartUpdate === "function") {
            await cartItems.onCartUpdate();
          }

          await updateCartIconBubble();
        } catch (error) {
          console.error("Error adding products to cart:", error);
        }
      };

      this.shadowRoot.querySelector(".continue-btn").onclick = async () => {
        try {
          await fetch("/cart/add.js", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: parseInt(mainProduct.id), quantity: 1 }),
          });

          modal.classList.remove("active");

          const cartItems =
            document.querySelector("cart-items") ||
            document.querySelector("cart-drawer-items");
          if (cartItems && typeof cartItems.onCartUpdate === "function") {
            await cartItems.onCartUpdate();
          }

          await updateCartIconBubble();
        } catch (error) {
          console.error("Error adding product to cart:", error);
        }
      };

      this.shadowRoot.querySelector(".modal-close").onclick = () => {
        const modal = this.shadowRoot.querySelector(".modal");
        modal.classList.remove("active");
      };

      const updateCartIconBubble = async () => {
        try {
          const res = await fetch(
            `${window.Shopify.routes.root}?sections=cart-icon-bubble`
          );
          const data = await res.json();
          const html = data["cart-icon-bubble"];
          const doc = new DOMParser().parseFromString(html, "text/html");
          const newBubble = doc.querySelector(".shopify-section");
          const oldBubble = document.querySelector("#cart-icon-bubble");

          if (newBubble && oldBubble) {
            oldBubble.innerHTML = newBubble.innerHTML;
          }
        } catch (error) {
          console.error("Error updating cart-icon-bubble:", error);
        }
      };

      if (this.showOnce) localStorage.setItem("modal_shown", "1");
    }
  }
);
