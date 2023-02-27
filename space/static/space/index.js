document.addEventListener('DOMContentLoaded', function () {
  // preventing forms from submitting on refresh
  if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
  }
  // collecting the collapsible buttons on index page
  var coll = document.getElementsByClassName('collapsible');
  var i;
  // looping through them and showing the content on click
  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener('click', function () {
      if (this.id === 'income') {
        show('income');
      } else if (this.id === 'goals') {
        show('goals');
      } else if (this.id === 'debts') {
        show('debts');
      } else if (this.id === 'expense') {
        show('expenses');
      }
    });
  }
});

// collecting btns to edit note
note_edit_btns = document.querySelectorAll('#note_edit');
note_edit_btns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    // the note id is stored in each note inside the class list
    id = btn.classList[2];
    // making the edit form visible and hiding the note itself
    note_form = document.querySelector(`#note_form${id}`);
    note_form.style.display = 'block';

    title = document.querySelector(`#note_title${id}`).innerHTML;
    details = document.querySelector(`#note_detail${id}`).innerHTML;

    titleinput = document.querySelector(`#note_newtitle${id}`);
    detailsinput = document.querySelector(`#note_newdetails${id}`);

    titleinput.value = title;
    detailsinput.value = details;

    note_card = document.querySelector(`#note_card${id}`);
    note_card.style.display = 'none';
  });
});

// collecting btns to save edited notes
note_save_btns = document.querySelectorAll('#note_save');
note_save_btns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    // the note id is stored in each note inside the class list
    id = btn.classList[2];
    // getting user input and calling a function to edit the note
    title = document.querySelector(`#note_newtitle${id}`).value;
    details = document.querySelector(`#note_newdetails${id}`).value;
    editGoal(id, title, details, 0, 0, 'note');
  });
});

// collecting btns to edit events
event_edit_btns = document.querySelectorAll('#event_edit');
event_edit_btns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    // the event id is stored in each event inside the class list
    id = btn.classList[2];
    // making the edit form visible and hiding the event itself
    event_form = document.querySelector(`#event_form${id}`);
    event_form.style.display = 'block';
    event_card = document.querySelector(`#event_card${id}`);
    event_card.style.display = 'none';
  });
});
// collecting btns to save edited events
event_save_btns = document.querySelectorAll('#event_save');
event_save_btns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    // the event id is stored in each event inside the class list
    id = btn.classList[2];
    // getting user input and calling a function to edit the event
    title = document.querySelector(`#event_newtitle${id}`).value;
    details = document.querySelector(`#event_newdetails${id}`).value;
    date = document.querySelector(`#event_newdate${id}`).value;
    editGoal(id, title, details, 0, date, 'event');
  });
});
// collecting btns to delete an event
event_del_btns = document.querySelectorAll('#event_del');
event_del_btns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    // the event id is stored in each event inside the class list
    id = btn.classList[2];
    // calling the delete function
    Delete(id, 'event');
  });
});
// collecting btns to edint a memory
memo_edit_btns = document.querySelectorAll('#memo_edit');
memo_edit_btns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    // the memory id is stored in each event inside the class list
    id = btn.classList[2];
    // making the edit form visible and hiding the memory itself
    memo_form = document.querySelector(`#memo_form${id}`);
    memo_form.style.display = 'block';
    memo_card = document.querySelector(`#memo_card${id}`);
    memo_card.style.display = 'none';
  });
});
// collecting btns to save edited memories
memo_save_btns = document.querySelectorAll('#memo_save');
memo_save_btns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    // the memory id is stored in each event inside the class list
    id = btn.classList[2];
    // getting user input and calling a function to edit the memory
    title = document.querySelector(`#memo_newtitle${id}`).value;
    details = document.querySelector(`#memo_newdetails${id}`).value;
    editGoal(id, title, details, 0, 0, 'memo');
  });
});
// collecting btns to delete memories
memo_del_btns = document.querySelectorAll('#memo_del');
memo_del_btns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    // the memory id is stored in each event inside the class list
    id = btn.classList[2];
    // calling the delete function
    note_delete(id, 'memo');
  });
});
// collecting btns to delete notes
del_btns = document.querySelectorAll('#del');
del_btns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    // the note id is stored in each event inside the class list
    id = btn.classList[2];
    // calling the delete function
    note_delete(id, 'note');
  });
});

// getting the csrf token to pass it in the api requests
var csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
var clicked = false;
// function that displays a form to add a goal
function addgoal() {
  var goals = document.querySelector('.goalss');
  if (goals.style.display == 'block') {
    goals.style.display = 'none';
  } else {
    goals.style.display = 'block';
  }
}
// function that displays a form to add an income
function addincome() {
  var income_form = document.querySelector('.incomes');
  if (income_form.style.display == 'block') {
    income_form.style.display = 'none';
  } else {
    income_form.style.display = 'block';
  }
}
// function that displays a form to add a debt
function adddebt() {
  var debt_form = document.querySelector('.debts');
  if (debt_form.style.display == 'block') {
    debt_form.style.display = 'none';
  } else {
    debt_form.style.display = 'block';
  }
}
// function that displays a form to add an expense
function addexpense() {
  var expense_formm = document.querySelector('.expensess');
  if (expense_formm.style.display == 'block') {
    expense_formm.style.display = 'none';
  } else {
    expense_formm.style.display = 'block';
  }
}
// function to display the topic the user clicked on
function show(topic) {
  //  collecting the content div in index.html and the forms and emptying them when needed
  var content = document.querySelector('.content');
  form = document.querySelector('.debts');
  form1 = document.querySelector('.incomes');
  form2 = document.querySelector('.goalss');
  form3 = document.querySelector('.expensess');

  if (form.style.display == 'block') {
    form.style.display = 'none';
  } else if (form1.style.display == 'block') {
    form1.style.display = 'none';
  } else if (form2.style.display == 'block') {
    form2.style.display = 'none';
  } else if (form3.style.display == 'block') {
    form3.style.display = 'none';
  }
  // if the content div is not being used
  if (content.style.display == 'none') {
    content.innerHTML = '';
    // fetching the topic content from the back-end models
    fetch(`/show/${topic}`, {
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
    })
      .then((response) => response.json())

      .then((pack) => {
        if (topic == 'goals') {
          //  if no content found
          if (pack.length == 0) {
            content.innerHTML += `<div id="goals"><div><button onclick='addgoal()' class="btn btn-dark btn-lg skill-btn" type="button">Add a
            Goal</button>
        </div>
        `;
          }
          // if content found
          else {
            content.innerHTML += `<div id="goals"><div><button onclick='addgoal()' class="btn btn-dark btn-lg skill-btn" type="button">Add a
            Goal</button>
        </div> <br>`;
            // looping through the fetched data and adding a card for each goal containing a hidden form for editing
            for (i = 0; i < pack.length; i++) {
              content.innerHTML += `
        
          <div class="card p-2 flex-fill">
          <div class="card-body" id="goal_card${pack[i]['id']}">
            <h4 class="card-title" id="goal_pretitle${pack[i]['id']}">${pack[i]['title']} <i class="fa-sharp fa-regular fa-circle-check" id="badge${pack[i]['id']}" style="display:none"></i> </h4>
            <p class="card-text" id="goal_predetails${pack[i]['id']}">${pack[i]['details']}</p>
            <p class="card-text" id="goal_total${pack[i]['id']}"><strong>Total:</strong> ${pack[i]['total']}</p>
            <p class="card-text remaining ${pack[i]['price']} ${pack[i]['id']}" id="goal_preprice${pack[i]['id']}"><strong>Remaining:</strong> ${pack[i]['price']}</p>
            <p class="card-text" id="goal_predate${pack[i]['id']}"><strong>Get it before:</strong> ${pack[i]['end_date']}</p>
            <div id="hidden_goal${pack[i]['id']}" style="display: none;">
            <input class="form-control" name="" required id="goal_title${pack[i]['id']}" value="${pack[i]['title']}">
            <input class="form-control" name="" id="goal_details${pack[i]['id']}" value="${pack[i]['details']}">
            <input class="form-control" name="" id="goal_price${pack[i]['id']}" value="${pack[i]['price']}">
            <input class="form-control" type="date" name="" id="goal_date${pack[i]['id']}" value="${pack[i]['end_date']}">
            <button class="edit btn btn-outline-info" id="save_goal" value="${pack[i]['id']}"  style="margin : 2px" >Save</button>
          </div>
          <div style="display: none;" id="goal_hidden_save${pack[i]['id']}">
            <input type="number" required id="goal_saved${pack[i]['id']}" Placeholder="Add saved amount">
              <button class="btn btn-info goal_saves" type="button" id="goal_savingss" value="${pack[i]['id']}">Save</button>
              <p id="invalid${pack[i]['id']}" style="color:red; display:none">Please enter a valid value</p>
          </div>
          
            <button class="btn btn-info goal_editing" type="button" id="goal_editing" value="${pack[i]['id']}">Edit</button>
            <button class="btn btn-success goal_editing savings${pack[i]['id']}" type="button" id="goal_saving" value="${pack[i]['id']}">Add saving</button>
              <button class="card-link btn btn-danger" id="goal_delete" value="${pack[i]['id']}">Delete</button></div>
        </div></div> <br>`;
            }
            // getting the amount remaining in the goal
            goal_remain = document.querySelectorAll('.remaining');
            goal_remain.forEach(function (goal) {
              remains = goal.classList[2];
              // if the amount is completely saved mark the goal as achieved
              if (remains == '0') {
                badge = document.querySelector(`#badge${goal.classList[3]}`);

                date = document.querySelector(
                  `#goal_predate${goal.classList[3]}`
                );
                saving_btn = document.querySelector(
                  `.savings${goal.classList[3]}`
                );
                // hiding unnecessary content and displaying the badge
                saving_btn.style.display = 'none';
                date.style.display = 'none';
                badge.style.display = 'inline';
                console.log(badge);
              }
            });
            // collecting btns to add a saving to the goal
            let goal_saving_btns = document.querySelectorAll('#goal_saving');
            goal_saving_btns.forEach(function (btn) {
              btn.addEventListener('click', function () {
                // the goal id is in the btn value
                id = btn.value;
                // getting the form and showing it
                console.log(document.querySelector(`#goal_saved${id}`));
                hidden = document.querySelector(`#goal_hidden_save${id}`);
                hidden.style.display = 'block';
                document.querySelector(`#goal_saved${id}`).value = '';
              });
            });
            // collecting btns to save the saved amount
            let saving_btns = document.querySelectorAll('#goal_savingss');
            saving_btns.forEach(function (btn) {
              btn.addEventListener('click', function () {
                // the goal id is in the btn value
                id = btn.value;
                // getting user input and calling the function to add to the backend while validating for empty input
                amount = document.querySelector(`#goal_saved${id}`).value;
                if (amount) {
                  saveGoal(id, amount, 'save_goal');
                } else {
                  document.querySelector(`#invalid${id}`).style.display =
                    'block';
                  document.querySelector(`#goal_saved${id}`).onchange =
                    function () {
                      amount = document.querySelector(`#goal_saved${id}`).value;
                      if (amount) {
                        document.querySelector(`#invalid${id}`).style.display =
                          'none';
                        saveGoal(id, amount, 'save_goal');
                      }
                    };
                }
              });
            });
            // collecting btns to delete goals
            let goal_delete_btns = document.querySelectorAll('#goal_delete');
            goal_delete_btns.forEach(function (btn) {
              btn.addEventListener('click', function () {
                // the goal id is in the btn value
                id = btn.value;
                // calling the delete function
                Delete(id, topic);
              });
            });
            // collecting btns to edit goals
            let goal_edit_btns = document.querySelectorAll('#goal_editing');
            goal_edit_btns.forEach(function (btn) {
              btn.addEventListener('click', function () {
                // the goal id is in the btn value
                goal = btn.value;
                // collecting the divs about the goal and hiding them then showing the edit form
                pretitle = document.querySelector(`#goal_pretitle${goal}`);
                predetails = document.querySelector(`#goal_predetails${goal}`);
                total = document.querySelector(`#goal_total${goal}`);
                preprice = document.querySelector(`#goal_preprice${goal}`);
                predate = document.querySelector(`#goal_predate${goal}`);
                edit_form = document.querySelector(`#hidden_goal${goal}`);
                pretitle.style.display = 'none';
                predetails.style.display = 'none';
                total.style.display = 'none';
                preprice.style.display = 'none';
                predate.style.display = 'none';
                edit_form.style.display = 'block';
                clicked = true;
              });
              // collecting btns to save the edited goals
              save_btns = document.querySelectorAll('#save_goal');
              save_btns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                  // the goal id is in the btn value
                  id = btn.value;
                  // collecting user input
                  title = document.querySelector(`#goal_title${id}`).value;
                  details = document.querySelector(`#goal_details${id}`).value;
                  price = document.querySelector(`#goal_price${id}`).value;
                  date = document.querySelector(`#goal_date${id}`).value;
                  // calling the function to edit to the backend
                  editGoal(id, title, details, price, date, topic);
                });
              });
            });
          }
        } else if (topic == 'income') {
          // emptying the content div
          content.innerHTML = '';
          //  if no content found
          if (pack.length == 0) {
            content.innerHTML += `<div id="income"><div><button onclick='addincome()' class="btn btn-dark btn-lg skill-btn" type="button">Add an
            Income</button>
        </div>
        `;
            //  if  content found
          } else {
            content.innerHTML += `<div id="income"><div><button onclick='addincome()' class="btn btn-dark btn-lg skill-btn" type="button">Add an
            Income</button>
        </div> <br>`;
            // looping through the fetched data and adding a card for each income containing a hidden form for editing
            for (i = 0; i < pack.length; i++) {
              content.innerHTML += `<div class="card p-2 flex-fill">
            <div class="card-body" id="income_card${pack[i]['id']}">
              <h5 class="card-title" id="income_pretitle${pack[i]['id']}">${pack[i]['title']}</h5>
              <h6 class="card-subtitle mb-2 text-muted" id="income_predate${pack[i]['id']}">${pack[i]['due_date']}</h6>
              <p class="card-text" id="income_preamount${pack[i]['id']}">${pack[i]['amount']}
              </p>
              <div id="hidden_income${pack[i]['id']}" style="display: none;">
            <input class="form-control" name="" id="income_title${pack[i]['id']}" value="${pack[i]['title']}">
            <input class="form-control" name="" id="income_amount${pack[i]['id']}" value="${pack[i]['amount']}">
            <input class="form-control" type="date" name="" id="income_date${pack[i]['id']}" value="${pack[i]['due_date']}">
            <button class="edit btn btn-outline-info" id="save_income" value="${pack[i]['id']}"  style="margin : 2px" >Save</button>
          </div>
          <button class="btn btn-info" type="button" id="income_editing" value="${pack[i]['id']}">Edit</button>
          <button class="btn btn-success" type="button" id="income_mark" value="${pack[i]['id']}">Mark as recieved</button>
              <button class="card-link btn btn-danger" id="income_delete" value="${pack[i]['id']}">Delete</button></div>
            </div>
            </div>
            
          </div></div> <br>
        `;
            }
            // collecting the btns to recieve income
            recieve_btns = document.querySelectorAll('#income_mark');
            recieve_btns.forEach(function (btn) {
              btn.addEventListener('click', function () {
                // the income id is in the btn value
                id = btn.value;
                // getting the income divs and calling a function to mark it as recieved
                date = document.querySelector(`#income_predate${id}`);
                income = document.querySelector(`#income_card${id}`);
                mark_income(id, 'mark', date, income);
              });
            });
            // collecting the btns to delete income
            let income_delete_btns =
              document.querySelectorAll('#income_delete');
            income_delete_btns.forEach(function (btn) {
              btn.addEventListener('click', function () {
                // the income id is in the btn value
                id = btn.value;
                // calling the delete function
                Delete(id, topic);
              });
            });
            // collecting the btns to edit income
            let income_edit_btns = document.querySelectorAll('#income_editing');
            income_edit_btns.forEach(function (btn) {
              btn.addEventListener('click', function () {
                // the income id
                income = btn.value;
                // getting the income divs and hiding them then showing the edit form
                pretitle = document.querySelector(`#income_pretitle${income}`);
                preamount = document.querySelector(
                  `#income_preamount${income}`
                );
                predate = document.querySelector(`#income_predate${income}`);
                edit_form = document.querySelector(`#hidden_income${income}`);
                pretitle.style.display = 'none';
                preamount.style.display = 'none';
                predate.style.display = 'none';
                edit_form.style.display = 'block';
              });
              // collecting the btns to save edited income
              save_btns = document.querySelectorAll('#save_income');
              save_btns.forEach(function (btn) {
                btn.addEventListener('click', function () {
                  // the income id
                  id = btn.value;
                  // getting user input and calling the edit function
                  title = document.querySelector(`#income_title${id}`).value;
                  price = document.querySelector(`#income_amount${id}`).value;
                  date = document.querySelector(`#income_date${id}`).value;
                  editGoal(id, title, 0, price, date, topic);
                });
              });
            });
          }
        } else if (topic == 'debts') {
          content.innerHTML = '';
          // if no content found
          if (pack.length == 0) {
            content.innerHTML += `<div id="debts"><div><button onclick='adddebt()' class="btn btn-dark btn-lg skill-btn" type="button">Add a
            Debt</button>
        </div>
        `;
            // if content found
          } else {
            content.innerHTML += `<div id="debts"><div><button onclick='adddebt()' class="btn btn-dark btn-lg skill-btn" type="button">Add a
            Debt</button>
        </div> <br>`;
            // looping through the fetched data and adding a card for each debt containing a hidden form for editing
            for (i = 0; i < pack.length; i++) {
              content.innerHTML += `
          <div class="card p-2 flex-fill">
            <div class="card-body" id="debt_card${pack[i]['id']}">
              <h5 class="card-title">${pack[i]['title']}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${pack[i]['due_date']}</h6>
              <p class="card-text" id="debt_total${pack[i]['id']}">Total: ${pack[i]['total']}</p>
              <strong>Remaining:</strong><p style="display: inline" class="card-text" id="debt_preamountt${pack[i]['id']}">${pack[i]['amount']}</p> <br><br>
              <div id="hidden_debt${pack[i]['id']}" style="display: none;">
            <input class="form-control" type="number" name="" id="debt_preamount${pack[i]['id']}">
            <button class="edit btn btn-outline-info" id="save_debt" value="${pack[i]['id']}"  style="margin : 2px" >Pay</button>
          </div>
              <button class="btn btn-info" type="button" id="debt_editing" value="${pack[i]['id']}">Pay some</button>
              <button class="card-link btn btn-danger" id="debt_delete" value="${pack[i]['id']}">Delete</button>
            </div>
          </div></div> <br>`;
            }
            // collecting btns to delete debts
            let debt_delete_btns = document.querySelectorAll('#debt_delete');
            debt_delete_btns.forEach(function (btn) {
              btn.addEventListener('click', function () {
                // the debt id
                id = btn.value;
                Delete(id, topic);
              });
            });
            // collecting btns to edit debts
            let debt_edit_btns = document.querySelectorAll('#debt_editing');
            debt_edit_btns.forEach(function (btn) {
              btn.addEventListener('click', function () {
                // the debt id
                id = btn.value;
                // showing the edit form
                edit_form = document.querySelector(`#hidden_debt${id}`);
                edit_form.style.display = 'block';
              });
            });
            // collecting btns to save the edited debts
            save_btns = document.querySelectorAll('#save_debt');
            save_btns.forEach(function (btn) {
              btn.addEventListener('click', function () {
                // the debt id
                id = btn.value;
                // getting user input
                debt = document.querySelector(`#debt_preamount${id}`).value;
                // calling the edit function
                editGoal(id, 0, 0, debt, 0, topic);
              });
            });
          }
        } else if (topic == 'expenses') {
          content.innerHTML = '';
          // if no content found
          if (pack.length == 0) {
            content.innerHTML += `<div id="expenses"><div><button onclick='addexpense()' class="btn btn-dark btn-lg skill-btn" type="button">Add an
            expense</button>
        </div>
        `;
            // if content found
          } else {
            content.innerHTML += `<div id="expenses"><div><button onclick='addexpense()' class="btn btn-dark btn-lg skill-btn" type="button">Add an
            expense</button>
        </div> <br>`;
            // looping through the fetched data and adding a card for each expense
            for (i = 0; i < pack.length; i++) {
              content.innerHTML += `
          <div class="card col-6">
            <div class="card-body">
              <h5 class="card-title">${pack[i]['title']}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${pack[i]['category']}</h6>
              <p class="card-text">${pack[i]['price']}
              </p>
            </div>
          </div></div> <br>`;
            }
          }
        }
        content.style.display = 'block';
      });
    // if the content div is being used
  } else {
    child = content.firstChild;
    // if the user wants to hide the content by clicking on its btn again
    if (child.id === topic) {
      content.innerHTML = '';
      content.style.display = 'none';
      return false;
      // if the user wants to show anothe content
    } else {
      content.innerHTML = '';
      content.style.display = 'none';
      show(topic);
    }
  }
}
// function to edit to any topic
function editGoal(id, title, details, price, date, topic) {
  if (topic == 'goals') {
    // fetching with PUT request with the csrf token included and passing the new values from the edit form
    fetch(`/edit/${id}/${topic}`, {
      method: 'PUT',
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
      body: JSON.stringify({
        title: title,
        details: details,
        price: price,
        date: date,
      }),
    }).then(function () {
      // collecting the divs and updating their values to the edited ones then hiding the edit form and showing the updated goal
      pretitle = document.querySelector(`#goal_pretitle${id}`);
      predetails = document.querySelector(`#goal_predetails${id}`);
      total = document.querySelector(`#goal_total${id}`);
      preprice = document.querySelector(`#goal_preprice${id}`);
      predate = document.querySelector(`#goal_predate${id}`);
      edit_form = document.querySelector(`#hidden_goal${id}`);
      pretitle.innerHTML = title;
      predetails.innerHTML = details;
      preprice.innerHTML = `<strong>Remaining:</strong> ${price}`;
      predate.innerHTML = date;
      edit_form.style.display = 'none';
      pretitle.style.display = 'block';
      predetails.style.display = 'block';
      total.style.display = 'block';
      preprice.style.display = 'block';
      predate.style.display = 'block';
    });
  } else if (topic == 'income') {
    // fetching with PUT request with the csrf token included and passing the new values from the edit form
    fetch(`/edit/${id}/${topic}`, {
      method: 'PUT',
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
      body: JSON.stringify({
        title: title,
        price: price,
        date: date,
      }),
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
    }).then(function () {
      // collecting the divs and updating their values to the edited ones then hiding the edit form and showing the updated income
      pretitle = document.querySelector(`#income_pretitle${id}`);
      preprice = document.querySelector(`#income_preamount${id}`);
      predate = document.querySelector(`#income_predate${id}`);
      edit_form = document.querySelector(`#hidden_income${id}`);
      pretitle.innerHTML = title;
      preprice.innerHTML = price;
      predate.innerHTML = date;
      edit_form.style.display = 'none';
      pretitle.style.display = 'block';
      preprice.style.display = 'block';
      predate.style.display = 'block';
    });
  } else if (topic == 'debts') {
    // fetching with PUT request with the csrf token included and passing the new values from the edit form
    fetch(`/edit/${id}/${topic}`, {
      method: 'PUT',
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
      body: JSON.stringify({
        price: price,
      }),
    }).then(function () {
      // collecting the divs and updating their values to the edited ones then hiding the edit form and showing the updated debt
      balance = document.querySelector('#user_balance').innerHTML;
      preprice = document.querySelector(`#debt_preamount${id}`);
      edit_form = document.querySelector(`#hidden_debt${id}`);
      edit_form.style.display = 'none';
      pre_debt = document.querySelector(`#debt_preamountt${id}`);
      debtt = parseInt(pre_debt.innerHTML) - parseInt(price);
      balance = parseInt(balance) - parseInt(price);
      pre_debt.innerHTML = debtt;
      document.querySelector('#user_balance').innerHTML = balance;
      if (debtt == '0') {
        document.querySelector(`#debt_card${id}`).style.display = 'none';
      }
      preprice.style.display = 'block';
    });
  } else if (topic == 'memo') {
    // fetching with PUT request with the csrf token included and passing the new values from the edit form
    fetch(`/edit/${id}/${topic}`, {
      method: 'PUT',
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
      body: JSON.stringify({
        title: title,
        details: details,
      }),
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
    }).then(function () {
      // collecting the divs and updating their values to the edited ones then hiding the edit form and showing the updated memory
      document.querySelector(`#memo_title${id}`).innerHTML = title;
      document.querySelector(`#memo_details${id}`).innerHTML = details;
      document.querySelector(`#memo_form${id}`).style.display = 'none';
      document.querySelector(`#memo_card${id}`).style.display = 'block';
    });
  } else if (topic == 'event') {
    // fetching with PUT request with the csrf token included and passing the new values from the edit form
    fetch(`/edit/${id}/${topic}`, {
      method: 'PUT',
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
      body: JSON.stringify({
        title: title,
        details: details,
        date: date,
      }),
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
    }).then(function () {
      // building the date format
      date = date.split('T');
      date = date[0] + ' , ' + date[1];
      // collecting the divs and updating their values to the edited ones then hiding the edit form and showing the updated event
      document.querySelector(`#event_title${id}`).innerHTML = title;
      document.querySelector(`#event_details${id}`).innerHTML = details;
      document.querySelector(`#event_date${id}`).innerHTML = date;
      document.querySelector(`#event_form${id}`).style.display = 'none';
      document.querySelector(`#event_card${id}`).style.display = 'block';
    });
  } else if (topic == 'note') {
    // fetching with PUT request with the csrf token included and passing the new values from the edit form
    fetch(`/edit/${id}/${topic}`, {
      method: 'PUT',
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
      body: JSON.stringify({
        title: title,
        details: details,
      }),
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
    }).then(function () {
      // collecting the divs and updating their values to the edited ones then hiding the edit form and showing the updated note
      document.querySelector(`#note_title${id}`).innerHTML = title;
      document.querySelector(`#note_detail${id}`).innerHTML = details;
      document.querySelector(`#note_form${id}`).style.display = 'none';
      document.querySelector(`#note_card${id}`).style.display = 'block';
    });
  }
}
// function to delete an entry from the database
function Delete(id, topic) {
  if (topic == 'goals') {
    // fetching with DELETE request with the csrf token included
    fetch(`/delete/${id}/${topic}`, {
      method: 'DELETE',
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
    }).then(function () {
      // hiding the deleted div till reload
      document.querySelector(`#goal_card${id}`).style.display = 'none';
    });
  } else if (topic == 'income') {
    // fetching with DELETE request with the csrf token included
    fetch(`/delete/${id}/${topic}`, {
      method: 'DELETE',
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
    }).then(function () {
      // hiding the deleted div till reload
      document.querySelector(`#income_card${id}`).style.display = 'none';
    });
  } else if (topic == 'debts') {
    // fetching with DELETE request with the csrf token included
    fetch(`/delete/${id}/${topic}`, {
      method: 'DELETE',
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
    }).then(function () {
      // hiding the deleted div till reload
      document.querySelector(`#debt_card${id}`).style.display = 'none';
    });
  } else if (topic == 'event') {
    // fetching with DELETE request with the csrf token included
    fetch(`/delete/${id}/${topic}`, {
      method: 'DELETE',
      headers: { 'X-CSRFToken': csrf_token },
      credentials: 'same-origin',
    }).then(function () {
      // hiding the deleted div till reload
      eventt = document.querySelector(`#event${id}`);
      eventt.style.display = 'none';
    });
  }
}
// function to apply savings that the user entered
function saveGoal(id, price, topic) {
  // fetching with PUT request with the csrf token included and passing user input
  fetch(`/edit/${id}/${topic}`, {
    method: 'PUT',
    headers: { 'X-CSRFToken': csrf_token },
    credentials: 'same-origin',
    body: JSON.stringify({
      amount: price,
    }),
    headers: { 'X-CSRFToken': csrf_token },
    credentials: 'same-origin',
  }).then(function () {
    // collecting the divs and updating their values to the edited ones then hiding the saving form and showing the updated goal
    form = document.querySelector(`#goal_hidden_save${id}`);
    form.style.display = 'none';
    old_amount = document.querySelector(`#goal_preprice${id}`).innerHTML;
    old_amount1 = old_amount.split(' ');
    balance = document.querySelector('#user_balance').innerHTML;
    new_amount = parseInt(old_amount1[1]) - parseInt(price);
    balance = parseInt(balance) - parseInt(price);
    console.log(balance);
    console.log(old_amount1, price, new_amount);
    document.querySelector(
      `#goal_preprice${id}`
    ).innerHTML = `<strong>Remaining:</strong> ${new_amount}`;
    document.querySelector('#user_balance').innerHTML = balance;
  });
}

// function to mark income as received
function mark_income(id, topic, date, income) {
  // fetching with PUT request and csrftoken included
  fetch(`/edit/${id}/${topic}`, {
    method: 'PUT',
    headers: { 'X-CSRFToken': csrf_token },
    credentials: 'same-origin',
  })
    .then((response) => response.json())
    .then((res) => {
      // the api returns "deleted" if the income frequency was initially set as once or the new income date if monthly
      // if the frequency is monthly
      if (res != 'deleted') {
        // updating the income card and the user's balance
        date.innerHTML = `Due: ${res}`;
        balance = document.querySelector('#user_balance').innerHTML;
        incoming = document.querySelector(`#income_preamount${id}`).innerHTML;
        balance = parseInt(balance) + parseInt(incoming);
        document.querySelector('#user_balance').innerHTML = balance;
      }
      // if the frequency is once
      else {
        // hiding the income card and updating the user's balance
        balance = document.querySelector('#user_balance').innerHTML;
        incoming = document.querySelector(`#income_preamount${id}`).innerHTML;
        balance = parseInt(balance) + parseInt(incoming);
        document.querySelector('#user_balance').innerHTML = balance;
        income.style.display = 'none';
      }
    });
}
// function to delete a note or a memory
function note_delete(id, topic) {
  // fetching with DELETE request with the csrftoken included
  fetch(`/delete/${id}/${topic}`, {
    method: 'DELETE',
    headers: { 'X-CSRFToken': csrf_token },
    credentials: 'same-origin',
  }).then(function () {
    if (topic == 'note') {
      // hiding the note card till reload
      note = document.querySelector(`.note${id}`);
      note.style.display = 'none';
    } else if ((topic = 'memo')) {
      // hiding the memory card till reload
      memo = document.querySelector(`#memo${id}`);
      memo.style.display = 'none';
    }
  });
}

function savess(id, amount) {}
