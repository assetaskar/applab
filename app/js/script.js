(function () {
	var mySwiper = new Swiper(".swiper-container", {
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});

	const divPricePlan = document.querySelector(".price__plan");

	const priceBusiness = document.getElementById("business-class");
	const priceMaster = document.getElementById("pro-master");

	const plan = {
		monthly: {
			business: 29,
			master: 99,
		},
		annually: {
			business: 19,
			master: 89,
		},
	};

	function selectionPlan(price = plan.monthly, className = false) {
		priceBusiness.innerHTML = "$" + price.business;
		priceMaster.innerHTML = "$" + price.master;

		className
			? divPricePlan.classList.add(className)
			: (divPricePlan.classList = divPricePlan.classList.item(0));
	}
	selectionPlan();
	document.getElementById("monthly").checked = true; // firefox при обновлении не обнуляется checked

	divPricePlan.addEventListener("click", event => {
		if (event.target.tagName === "DIV") return;

		event.target.id === "annually"
			? selectionPlan(plan[event.target.id], event.target.id)
			: selectionPlan();
	});

	const faq = document.querySelector(".faq__list");
	const faqItems = document.querySelectorAll(".faq__item");

	faq.addEventListener("click", event => {
		if (event.target.tagName !== "H3") return;

		faqItems.forEach(question => {
			question === event.target.closest(".faq__item")
				? question.classList.add("show")
				: question.classList.remove("show");
		});
	});
})();
