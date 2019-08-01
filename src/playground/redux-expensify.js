import { createStore, combineReducers } from "redux";
import uuid from "uuid";
//add expense generator
// here we are implicitely returning an action object (use curly braces to wrap around it)
//we are destructuring the code and the default is set to an object
const addExpense = ({
  description = "",
  note = "",
  amount = 0,
  createdAt = 0
} = {}) => ({
  type: "ADD_EXPENSE",
  // This one is the payload & the value is coming from the user
  expense: {
    id: uuid(),
    description,
    note,
    amount,
    createdAt
  }
});

//Remove expense action creator
const removeExpense = ({ id } = {}) => ({
  type: "REMOVE_EXPENSE",
  id // now handle this one in the Expensereduce which is responsible for this state change
});

//action generator for editing expense
const editExpense = (id, updates) => ({
  type: "EDIT_EXPENSE",
  id,
  updates
});

//action creator for setting the text field // text is default to empty string if none is passed
const setTextFilter = (text = "") => ({
  type: "SET_TEXT_FILTER",
  text
});

//we need two reducers to manage the state (one for the expenses array, other is for filters object)

//we need to provide the default state for the expense reducer
// here the initial state is an array as because the default expenses state is an array provided inside demo state
const expensesReducerDefaultState = [];

//Expenses Reducer
// here state only contains the expense array
const expensesReducer = (state = expensesReducerDefaultState, action) => {
  switch (action.type) {
    case "ADD_EXPENSE":
      //as state is an array here we can concat(instead of push as it changes the original array) the value to the state & returns a new array
      // but we can use spread operator instead of concat
      return [...state, action.expense];

    case "REMOVE_EXPENSE":
      // here expense reducer has only access to the expense array
      // we are destructuring the expense object and getting the id
      return state.filter(({ id }) => {
        return id !== action.id; // here action.id is given by dispatching action with the id
      });

    case "EDIT_EXPENSE":
      // here the state constains only the expense array
      return state.map(expense => {
        if (expense.id === action.id) {
          // returning the new object
          return {
            ...expense,
            ...action.updates // this is the new update object
          };
        } else {
          return expense; // return state
        }
      });
    default:
      return state;
  }
};

//filters reducer--- this is for managing the filters inside of the store
//its an object because in demo state, filter is an object
const filterReducerDefaultState = {
  text: "",
  sortBy: "date",
  startDate: undefined,
  endDate: undefined
};

//create the reducer
const filtersReducer = (state = filterReducerDefaultState, action) => {
  switch (action.type) {
    case "SET_TEXT_FILTER":
      return {
        ...state,
        text: action.text
      };
    default:
      return state;
  }
};

//creating the store
const store = createStore(
  //combining multiple reducers together
  //combine reducer takes an object as an argument.. on this object we provide the key value pair (key==> root state name, value===> reducer that gonna manage that)
  // here we have expenses and filter at the root & the value for them is the reducer assigned for them
  combineReducers({
    expenses: expensesReducer,
    filters: filtersReducer
  })
);

//tracking changes to the state
store.subscribe(() => {
  //watching the store value
  console.log(store.getState());
});

//we are dispatching action here // here addExpense is an action generator
//we are passing an object to the generator
// this is going to dispatch to both reducers (expenseReducer & filterReducer)
// here default case will be running for filterReducer & in expenseReducer switch statement will handle this one
// dispatching an action object returns an object & we can store that to get the id provided
// the returned object contains the action object from the action creator ( the object field contains type and expense field mentioned in the action creator)
const expense1 = store.dispatch(
  addExpense({ description: "Rent", amount: 100 })
);
const expense2 = store.dispatch(
  addExpense({ description: "Coffee", amount: 300 })
);

//watching the return value from expense1
// console.log(expense1);

//removing the 1st expense
store.dispatch(removeExpense({ id: expense1.expense.id }));

// editing the second expense object
store.dispatch(editExpense(expense2.expense.id, { amount: 500 })); // the amount is sent inside an object for easily changing the previous object with the new value using the spread syntax

// adding the text for the filter text
store.dispatch(setTextFilter("rent"));
// Setting again the text input to empty string
store.dispatch(setTextFilter());

//This is the state of the application
const demoState = {
  expenses: [
    {
      id: "poijasdfhwer",
      description: "January Rent",
      note: "This was the final payment for that address",
      amount: 54500,
      createdAt: 0
    }
  ],
  filters: {
    text: "rent",
    sortBy: "amount", // date or amount
    startDate: undefined,
    endDate: undefined
  }
};
