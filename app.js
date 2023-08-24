
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

class CarsListAPI {
  static url = 'https://64e526dfc555638029142f27.mockapi.io/PromineoTechAPI/CarsList';

  static getCarsList() {
    return $.get(this.url)
  }

  static getCar(id) {
    return $.get(this.url + `/${id}`)
  }

  static deleteCarTb(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: 'DELETE'
    })
  }

  static updateCarsList(car) {
    return $.ajax({
      url: this.url + `/${car._id}`,
      dataType: 'json',
      data: JSON.stringify(car),
      contentType: 'application/json',
      type: 'PUT'
    });
  }

  static createCar(car) {
    return $.post(this.url, car)
  }
}

class DOMManager {
  static cars;

  static createCarsTable() {
    CarsListAPI.getCarsList()
                .then(cars => this.render(cars))
  }

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

  static addCar(make, model, year) {
    CarsListAPI.createCar(new Cars(make, model, year))
      .then(this.createCarsTable());
  }

  static deleteCar(id) {
    CarsListAPI.deleteCarTb(id)
      .then(() => this.createCarsTable());
  }

  static editCar(id) {
    let carData;
    let car = CarsListAPI.getCar(id)
      .then(data => data);
    let makeInputs = $(`
    <td><input type="text" name="newCarMake" id="newCarMake" class="form-control" placeholder=${car.carMake}></td>
    <td><input type="text" name="newCarModel" id="newCarModel" class="form-control" placeholder=${car.carModel}></td>
    <td><input type="number" name="newCarYear" id="newCarYear" class="form-control" placeholder=${car.year}></td>
    <td>
    <button class="btn btn-info" id="saveBtn" onclick="DOMManager.saveInfo(${$('#newCarMake').val(),$('#newCarModel').val(),$('#newCarYear').val()}-id)">Save</button></td>
    `);
    $(`.${id}`).empty();
    $(`.${id}`).prepend(makeInputs);
  }

  static saveInfo(make, model, year) {
    CarsListAPI.updateCarsList(new Cars(make, model, year))
      .then(this.createCarsTable());
  }

}

submitBtn.on('click', ()=> {
  if(carMake.val() !== '' && carModel.val() !== '' & carYear.val() !== '') {
    DOMManager.addCar(carMake.val(), carModel.val(), carYear.val());
  carMake.val('');
  carModel.val('');
  carYear.val('');
  }
});

// saveBtn.on('click', () => {
//   const newMake = $('#newCarMake');
//   const newModel = $('#newCarModel');
//   const newYear = $('#newCarYear');
//   if(newMake.val() !== '' && newModel.val() !== '' & newYear.val() !== '') {
//     DOMManager.saveInfo(newMake.val(), newModel.val(), newYear.val());
//   carMake.val('');
//   carModel.val('');
//   carYear.val('');
//   }
// })


DOMManager.createCarsTable();


