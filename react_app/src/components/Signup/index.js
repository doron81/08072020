import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../../services/auth.service";

const SignupSchema = yup.object().shape({
	email: yup.string().email().required(),
	password: yup.string().required().min(8),
	username: yup
		.string()
		.required()
		.test("White spaces", "White spaces are not allowed", function (
			value
		) {
			if (value.indexOf(" ") !== -1) {
				return false;
			}
			return true;
		}),
});

export default function Signup(props) {
	const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(SignupSchema),
	});

	const onSubmit = (values) => {
		AuthService.register(
			values.username,
			values.email,
			values.password
		).then((res) => {
			if (res.data.success === "false") {
				toast.error(res.data.msg, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
				return;
			} else if (res.data.errors && res.data.errors.length > 0) {
				res.data.errors.forEach((error) => {
					toast.error(error.msg, {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
				});
				return;
			} else {
				props.history.push("/");
				window.location.reload();
			}
		});
	};

	return (
		<div>
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label>Username</label>
					<input type="text" name="username" ref={register} />
					{errors.username && <p>{errors.username.message}</p>}
				</div>
				<div style={{ marginBottom: 10 }}>
					<label>Email</label>
					<input type="email" name="email" ref={register} />
					{errors.email && <p>{errors.email.message}</p>}
				</div>
				<div>
					<label>Password</label>
					<input
						type="password"
						name="password"
						ref={register}
					/>
					{errors.password && <p>{errors.password.message}</p>}
				</div>
				<input type="submit" />
			</form>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</div>
	);
}
