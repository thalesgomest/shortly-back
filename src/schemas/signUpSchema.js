import joi from 'joi';

const SignUpSchema = joi.object().keys({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi
        .valid(joi.ref('password'))
        .label("passwords don't match"),
});

export default SignUpSchema;
