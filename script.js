const container = document.querySelector('.container')
const userInputElement = document.getElementById('item')
const btn = document.getElementById('btn')
const foodElement = document.querySelector('.food-section')

userInputElement.addEventListener('keyup', (event) => {
    if (event.key == "Enter") {
        fetchingFromAPI()
    }
})

btn.addEventListener('click', (event) => {
    event.preventDefault()
    fetchingFromAPI()
})

function displayTheContents(responseFromAPI) {

    foodElement.classList.add('food-section')
    if (responseFromAPI.meals == null) {
        foodElement.innerHTML = `<span>Please Enter the Valid Ingredients...</span>`
    }
    else {
        const meals = responseFromAPI.meals
        const MEALELEMENTS = meals.map((meal) => {
            const element = `
                    <div class="item">
                        <img src="${meal.strMealThumb}" alt=${meal.strMealThumb} loading="lazy" />
                        <h2>${meal.strMeal.trim()}</h2>
                        <button class="instruction">See Instructions</button>
                    </div>
                `
            return element
        })
        const FOODITEMS = MEALELEMENTS.join("")
        foodElement.innerHTML = FOODITEMS
        container.appendChild(foodElement)

        const foodItems = document.querySelectorAll('.instruction')
        foodItems.forEach((element) => {
            element.addEventListener('click', () => {
                showInstructions(element, meals)
            })
        })
    }
}

async function fetchingFromAPI() {
    const userIngredients = userInputElement.value
    if (userIngredients == "") {
        alert('Please Enter the Ingredients!!!')
    }
    else {
        const fetchingDetails = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${userIngredients}`)
        const responseFromAPI = await fetchingDetails.json()
        displayTheContents(responseFromAPI)
    }
}

const pop = document.createElement('div')
pop.classList.add('pop')


function showInstructions(recipeProcedure, mealsId) {
    const recipeName = recipeProcedure.previousElementSibling.textContent
    mealsId.forEach(async (value) => {
        if (recipeName == value.strMeal.trim()) {
            const mealID = value.idMeal
            const fetching = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
            const response = await fetching.json()

            pop.innerHTML = `
                    <div class="pop-window">
                            <div class="cross">
                                <i class='bx bx-x remove'></i>
                            </div>

                            <div class="main">
                                <div class="headings">
                                    <h2>${recipeName}</h2>
                                    <h3>${response.meals[0].strCategory}</h3>
                                </div>
                                <div class="instruct">
                                    <h3>Instructions : </h3>
                                    <p>${response.meals[0].strInstructions}</p>
                                </div>

                                <div class="recipe-img">
                                    <img src="${response.meals[0].strMealThumb}" alt="${recipeName}">
                                </div>

                                <div class="link">
                                    <a href="${response.meals[0].strYoutube}" target="blank">
                                        <button>Video Tutorial</button>
                                    </a>
                                </div>
                            </div>
                    </div>
            `

            container.appendChild(pop)
            const removeBtn = document.querySelector('.remove')
            removeBtn.addEventListener('click', () => {
                pop.remove()
            })
            pop.classList.add('slowmo')
        }
    })

}
