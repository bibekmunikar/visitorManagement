let step = document.getElementsByClassName('step');
let prevBtn = document.getElementById('prev-btn');
let nextBtn = document.getElementById('next-btn');
let submitBtn = document.getElementById('submit-btn');
let form = document.getElementsByTagName('form')[0];
let preloader = document.getElementById('preloader-wrapper');
let bodyElement = document.querySelector('body');
let succcessDiv = document.getElementById('success');

// form.onsubmit = () => {
//     return false
// }
let current_step = 0;
let stepCount = 3
step[current_step].classList.add('d-block');

if (current_step == 0) {
    prevBtn.classList.add('d-none');
    submitBtn.classList.add('d-none');
    nextBtn.classList.add('d-inline-block');
}

const progress = (value) => {
    document.getElementsByClassName('progress-bar')[0].style.width = `${value}%`;
}

nextBtn.addEventListener('click', () => {
    current_step++;
    let previous_step = current_step - 1;
    if ((current_step > 0) && (current_step <= stepCount)) {
        prevBtn.classList.remove('d-none');
        prevBtn.classList.add('d-inline-block');
        step[current_step].classList.remove('d-none');
        step[current_step].classList.add('d-block');
        step[previous_step].classList.remove('d-block');
        step[previous_step].classList.add('d-none');
        if (current_step == stepCount) {
            submitBtn.classList.remove('d-none');
            submitBtn.classList.add('d-inline-block');
            nextBtn.classList.remove('d-inline-block');
            nextBtn.classList.add('d-none');
        }
    } else {
        if (current_step > stepCount) {
            form.onsubmit = () => {
                return true
            }
        }
    }
    progress((100 / stepCount) * current_step);
});
 
 
prevBtn.addEventListener('click', () => {
    if (current_step > 0) {
        current_step--;
        let previous_step = current_step + 1;
        prevBtn.classList.add('d-none');
        prevBtn.classList.add('d-inline-block');
        step[current_step].classList.remove('d-none');
        step[current_step].classList.add('d-block')
        step[previous_step].classList.remove('d-block');
        step[previous_step].classList.add('d-none');
        if (current_step < stepCount) {
            submitBtn.classList.remove('d-inline-block');
            submitBtn.classList.add('d-none');
            nextBtn.classList.remove('d-none');
            nextBtn.classList.add('d-inline-block');
            prevBtn.classList.remove('d-none');
            prevBtn.classList.add('d-inline-block');
        }
    }
 
    if (current_step == 0) {
        prevBtn.classList.remove('d-inline-block');
        prevBtn.classList.add('d-none');
    }
    progress((100 / stepCount) * current_step);
});
 
 
submitBtn.addEventListener('click', () => {
    preloader.classList.add('d-block');
 
    const timer = ms => new Promise(res => setTimeout(res, ms));
 
    timer(3000)
        .then(() => {
            bodyElement.classList.add('loaded');
        }).then(() => {
            step[stepCount].classList.remove('d-block');
            step[stepCount].classList.add('d-none');
            prevBtn.classList.remove('d-inline-block');
            prevBtn.classList.add('d-none');
            submitBtn.classList.remove('d-inline-block');
            submitBtn.classList.add('d-none');
            succcessDiv.classList.remove('d-none');
            succcessDiv.classList.add('d-block');
        })
 
});


// // public/script.js
$(document).ready(function () {
    $('#sign_in').click(function () {
        // Hide all content divs
        $('[id^="content"]').hide();

        // Show the next content div
        const currentContentId = $('div:visible').attr('id');
        const nextContentId = currentContentId === 'content1' ? 'content2' : 'content1';

        $('#' + nextContentId).show();
    });
});


//AUTOCOMPLETE SEARCH ON SIGNINconst employeeSearchInput = document.getElementById("employeeSearch");
const employeeSuggestionsList = document.getElementById("employeeSuggestions");
const visitingEmployeeIdInput = document.getElementById("visiting_employee_id");

employeeSearchInput.addEventListener("input", debounce(handleEmployeeSearch, 300));

function debounce(func, delay) {
   let timeoutId;
   return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(context, args), delay);
   };
}

function handleEmployeeSearch() {
   const searchQuery = employeeSearchInput.value.trim();

   if (searchQuery.length === 0) {
      employeeSuggestionsList.innerHTML = ''; 
      return;
   }

   fetch(`/autocomplete?query=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
         employeeSuggestionsList.innerHTML = '';
         data.forEach(employee => {
            const option = document.createElement("option");
            option.value = employee.full_name;
            employeeSuggestionsList.appendChild(option);
         });
      })
      .catch(error => console.error("Error fetching autocomplete data:", error));
}

// Add an event listener to set the visiting_employee_id when an employee is selected
employeeSuggestionsList.addEventListener("input", (event) => {
   const selectedEmployee = data.find(employee => employee.full_name === event.target.value);
   if (selectedEmployee) {
      visitingEmployeeIdInput.value = selectedEmployee.id;
   } else {
      // Handle case when no employee is selected
      visitingEmployeeIdInput.value = '';
   }
});
