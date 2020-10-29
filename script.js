//elements

const balanceEl = document.querySelector('.balance-value');
const incomeTotalEl = document.querySelector('.income-total');
const outcomeTotalEl = document.querySelector('.outcome-total');
const chartEl = document.querySelector('.chart');
const expenseEl = document.querySelector('#expense');
const incomeEl = document.querySelector('#income');
const allEl = document.querySelector('#all');
const expenseList = document.querySelector('#expense .list')
const incomeList = document.querySelector('#income .list');
const allList = document.querySelector('#all .list');

//buttons
const incomeTab = document.querySelector('.tab1');
const expenseTab = document.querySelector('.tab2');
const allTab = document.querySelector('.tab3');

const addIncomeBtn = document.querySelector('.add-income');
const incomeTitleInput = document.querySelector('#income-title-input');
const incomeAmountInput = document.querySelector('#income-amount-input');

const addExpenseBtn = document.querySelector('.add-expense');
const expenseTitleInput = document.querySelector('#expense-title-input');
const expenseAmountInput = document.querySelector('#expense-amount-input');


//event listeners for tabs
incomeTab.addEventListener('click', function() {
    show(incomeEl);   //removing class 'hide' from the income tab
    hide( [expenseEl, allEl] ); //setting class 'hide' for expense-tab and all-tab 
    active(incomeTab); //setting class 'active' for income-tab
    inactive( [expenseTab, allTab] ); //removing class 'active' for expense-tab and all-tab
});

expenseTab.addEventListener('click', function() {
    show(expenseEl);
    hide( [incomeEl, allEl] );
    active(expenseTab);
    inactive( [incomeTab, allTab] );
});

allTab.addEventListener('click', function() {
    show(allEl);
    hide( [expenseEl, incomeEl] );
    active(allTab);
    inactive( [expenseTab, incomeTab] );
});

//event listeners for lists to hear clicking on edit or delete btns
incomeList.addEventListener('click', deleteOrEdit);
expenseList.addEventListener('click', deleteOrEdit);
allList.addEventListener('click', deleteOrEdit);



// additional variables
let listOfNotations;
let income = 0;
let outcome = 0;
let balance = 0;
const DELETE = 'delete';
const EDIT = 'edit';

listOfNotations = JSON.parse(localStorage.getItem('item_list')) || [];
updateScreen();
addingItemOnScreen();


//functions
// event listener for ADD INCOME button
addIncomeBtn.addEventListener('click', function() {
      if(!incomeAmountInput.value || !incomeTitleInput.value) return;  //if at least one field is empty => function does not run

      let income = {
          type: 'income',
          title: incomeTitleInput.value,
          amount: parseFloat(incomeAmountInput.value)
      }
      listOfNotations.push(income);
      
      updateScreen();         //updating all total values on screen
      addingItemOnScreen();   //adding li's in tabs
      cleanInputs( [incomeTitleInput, incomeAmountInput] );  //cleaning inputs after adding
});

// event listener for ADD EXPENSE button
addExpenseBtn.addEventListener('click', function() {
      if(!expenseAmountInput.value || !expenseTitleInput.value) return;  //if at least one field is empty => function does not run

      let expense = {
          type: 'expense',
          title: expenseTitleInput.value,
          amount: parseFloat(expenseAmountInput.value)
      }
      listOfNotations.push(expense);
      
      updateScreen();         //updating all total values on screen
      addingItemOnScreen();   //adding li's in tabs
      cleanInputs( [expenseTitleInput, expenseAmountInput] );  //cleaning inputs after adding
});



//listening what button is clicking - edit or delete
function deleteOrEdit(event) {
    const targetBtn = event.target;
    const item = targetBtn.parentNode;

    if(targetBtn.id == DELETE) {
        deleteItem(item);
    } else if (targetBtn.id == EDIT) {
        editItem(item);
    }
}

//deleting item from obj listOfNonations
function deleteItem(item) {
    listOfNotations.splice(item.id, 1);
    updateScreen();
    addingItemOnScreen();
}

//editing item from obj listOfNonations
function editItem(item) {
    let ITEM = listOfNotations[item.id];

    if (ITEM.type == 'income') {
        incomeTitleInput.value = ITEM.title;
        incomeAmountInput.value = ITEM.amount;
    } else if (ITEM.type == 'expense') {
        expenseTitleInput.value = ITEM.title;
        expenseAmountInput.value = ITEM.amount;
    }
    deleteItem(item);
}



//updating all total values on screen
function updateScreen() {
    income = calcTotals('income', listOfNotations);
    outcome = calcTotals('expense', listOfNotations);   
    balance = calcBalance(income, outcome);

    //showing total in the head
    incomeTotalEl.innerHTML = `$ ${income}`;
    outcomeTotalEl.innerHTML = `$ ${outcome}`;
    balanceEl.innerHTML = `$ ${balance}`;

    //cleaning lists before adding new li
    clearLists( [incomeList, expenseList, allList]);

    localStorage.setItem('item_list', JSON.stringify(listOfNotations));
}


// calculating the sum of income or expenses
function calcTotals(type, listOfNotations) {
    let sum = 0;

    listOfNotations.forEach(item => {
        if(item.type === type) {
            sum += item.amount;
        }
    });
    return sum;
}

//calculating balance
function calcBalance(income, outcome) {
    return income - outcome;
}


//cleaning lists
function clearLists(listArray){
    listArray.forEach(list => {
        list.innerHTML = '';
    })
}



//adding li's in tabs
function addingItemOnScreen() {
    listOfNotations.forEach((item, index) => {
        if(item.type == 'income') {
            updateList(incomeList, item.type, item.title, item.amount, index)
        } else if (item.type == 'expense') {
            updateList(expenseList, item.type, item.title, item.amount, index)
        } 
        updateList(allList, item.type, item.title, item.amount, index)
    })
}


//putting new li into List
function updateList(list, type, title, amount, id) {
    const item = `<li id = ${id} class = "${type}">
                    <div class = "entry">${title}: $${amount}</div>
                    <div id="edit"></div>
                    <div id="delete"></div>
                </li>`; 
    const position = 'afterbegin';
    list.insertAdjacentHTML(position, item);
}


//cleaning inputs
function cleanInputs(inputs) {
    inputs.forEach(input => {
        input.value = '';
    });
}

// functions for toggling
function active(element) {
    element.classList.add('active');
}

function inactive (elements) {
    elements.forEach(element => {
        element.classList.remove('active');
    });
}

function show(element) {
    element.classList.remove('hide');
}

function hide(elements) {
    elements.forEach(element => {
        element.classList.add('hide');
    });
}