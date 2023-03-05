import JustValidate from "just-validate";

const validator = new JustValidate('#basic_form');

validator
	.addField('#basic_name', [
		{
			rule: 'required'
		},
		{
			rule: 'minLength',
			value: 3,
			errorMessage: function (value) {
				console.log(context);
			},
		},
		{
			rule: 'maxLength',
			value: 15,
		},
	])
	.addField('#basic_email', [
		{
			rule: 'required',
		},
		{
			rule: 'required',
		},
		{
			rule: 'email',
		},
	])
	.addField('#basic_password', [
		{
			rule: 'required',
		},
		{
			rule: 'password',
		},
	])
	.addField('#basic_age', [
		{
			rule: 'required',
		},
		{
			rule: 'number',
		},
		{
			rule: 'minNumber',
			value: 18,
		},
		{
			rule: 'maxNumber',
			value: 150,
		},
	]);