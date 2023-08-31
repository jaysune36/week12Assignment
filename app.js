// Used Jquery to grab each elements ID on my HTML page that would be needed to be manipulated.
const submitBtn = $('#submitBtn');
const carMake = $('#carMake');
const carModel = $('#carModel');
const carYear = $('#carYear');
const saveBtn = $('#saveBtn')

// Car Class accepts 3 arguments. Make and Model arguments are a string and Year is a number
class Cars {
  constructor(make, model, year){
    this.carMake = make;
    this.carModel = model;
    this.year = year;
  }
}

// CarsListAPI class will house and run all the API methods needed to CREATE, READ, UPDATE, DELETE(CRUD).
class CarsListAPI {
  //saved the MockAPI url to a static varialble 
  static url = 'https://64e526dfc555638029142f27.mockapi.io/PromineoTechAPI/CarsList';

  // Using Jquery get method to request the MockAPI's page.
  static getCarsList() {
    return $.get(this.url)
  }
  // Using Jquery get method again, but passing an 1 argument for the ID. This will request that specific item from the API when it is concatenated to url.
  static getCar(id) {
    return $.get(this.url + `/${id}`)
  }
  // This delete method accepts 1 argument the id and using the ajax jquery method is called on that URL + ID to DELETE the item from the API.
  static deleteCarTb(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: 'DELETE'
    })
  }
  // The updateCarsList method accepts 2 arguments and ID and CAR. The ID is passed in from that specific car on the API object and then the 2nd argument accepts a the Cars class to write the informaiton using JSON.stringify and update(or PUT) the new object information to that API
  static updateCarsList(id, car) {
    return $.ajax({
      url: this.url + `/${id}`,
      dataType: 'json',
      data: JSON.stringify(car),
      contentType: 'application/json',
      type: 'PUT'
    });
  }
  // CreateCar method accepts 1 argument a class. After passing in a Car class this will add(or POST) the new object to the MockAPI.
  static createCar(car) {
    return $.post(this.url, car)
  }
}

// DOMManager class runs all the DOM methods.
class DOMManager {
  // Cars static variable is not set, but will be defined later to hold the data from the API.
  static cars;
  // The createCarsTable will run the getCarsList method on the CarsListAPI and then render these items to the table under the index.html file
  static createCarsTable() {
    CarsListAPI.getCarsList()
                .then(cars => this.render(cars))
  }
  // The render method will accept 1 argument the cars(or data from API). This will then call the table body and empty the body and and set the static cars variable to the cars argument passed into it. Then Using a for of loop it will use a template literal to write the new <td> tags that will house the make, model, and year of the car as well as add 2 buttons(delete and edit) with eventlisteners.
  static render(cars) {
    $('tbody').empty();
    this.cars = cars;
    for(let car of cars ) {
      $('tbody').prepend(`
      <tr class="${car.id}">
        <td>${car.carMake}</td>
        <td>${car.carModel}</td>
        <td>${car.year}</td>
        <td>
        <button class="btn btn-danger" onclick="DOMManager.deleteCar(${car.id}-id)">Delete</button>
        <button class="btn btn-success" onclick="DOMManager.editCar(${car.id}-id)">Edit</button>
        </td>
      </tr>
    `)
    }
  }
  // the addCar method will accept 3 arguments which are the 3 arguments from the Cars class. It will then use the createCar method on the CarsListAPI and pass in those arguments to add a new Car to the API.
  static addCar(make, model, year) {
    CarsListAPI.createCar(new Cars(make, model, year))
      .then(this.createCarsTable());
  }
  // The deleteCar method accepts 1 argument an ID and will run he deleteCarTb method to delete the object from the API and then calls the createCarsTable method to re-render the table.
  static deleteCar(id) {
    CarsListAPI.deleteCarTb(id)
      .then(() => this.createCarsTable());
  }
  // the editCar method accepts 1 argument an ID from the API object. This will then call the getCar method to get that specific car object and in each <td> tag add an input field and then change the delete and edit buttons to a save button. 
  static editCar(id) {
    CarsListAPI.getCar(id)
      .then(data => {
    let makeInputs = $(`
    <td><input type="text" name="newCarMake" id="newCarMake${id}" class="form-control" placeholder=${data.carMake}></td>
    <td><input type="text" name="newCarModel" id="newCarModel${id}" class="form-control" placeholder=${data.carModel}></td>
    <td><input type="number" name="newCarYear" id="newCarYear${id}" class="form-control" placeholder=${data.year}></td>
    <td>
    <button class="btn btn-info" id="saveBtn" onclick="DOMManager.saveInfo(${id})">Save</button></td>
    `);
    $(`.${id}`).empty();
    $(`.${id}`).prepend(makeInputs);
      })
    
  }
  // saveInfo method accepts the ID from the API object that is being edited. It will then take those new values and update the table to the new values passed into it as well as update that ID with the new data.
  static saveInfo(id) {
    CarsListAPI.updateCarsList(id, new Cars($(`#newCarMake${id}`).val(), $(`#newCarModel${id}`).val(), $(`#newCarYear${id}`).val()))
      .then(()=>this.createCarsTable());
  }

}
// SubmitBtn eventlistener will run once the submit button is clicked. It will take the input values within the form tag and pass those values to the addCar method on the DOMManager class and then create the table again with the newly added API object. It will then reset the input values back to empty strings.
submitBtn.on('click', ()=> {
  if(carMake.val() !== '' && carModel.val() !== '' & carYear.val() !== '') {
    DOMManager.addCar(carMake.val(), carModel.val(), carYear.val());
    DOMManager.createCarsTable();
  carMake.val('');
  carModel.val('');
  carYear.val('');
  }
});

// The DOMManager class is automatically called to read if there are any API's and if so to render them to the index.html file.
DOMManager.createCarsTable();

