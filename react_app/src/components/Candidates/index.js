import React, { useState } from "react";
import { MDBDataTable } from "mdbreact";
import { Image } from "semantic-ui-react";
import { Helmet } from "react-helmet";
import Page from "../Page";
import { useAsync } from "react-async";

const fetchUsers = async () => {
	const res = await fetch("http://localhost:8080/api/candidates", {
		method: "GET",
		headers: {
			"content-type": "application/json",
			"x-access-token": localStorage.getItem("user"),
		},
		mode: "cors",
	});
	if (!res.ok) throw new Error(res.statusText);
	return res.json();
};

export default function Candidates(props) {
	const [rows, setRows] = useState([]);
	const [once, setOnce] = useState(true)
	const { data, isPending } = useAsync({
		promiseFn: fetchUsers,
	});
	if (isPending) return "Loading...";
	if (data.success === "false") {
		localStorage.removeItem("user");
		props.history.push("/login");
	}
	if(data.success === "true" && once){
		const rows = data.candidates.map((user) => {
			return {
				first_name: user.first_name,
				last_name: user.last_name,
				job_title: user.job_title,
				avatar: <Image src={user.avatar} width="100" />,
				profile: (
					<button
						key={user.id}
						onClick={() => goToProfile(user.id)}
					>
						See My Profile
					</button>
				),
			};
		});
		setRows(rows);
		setOnce(false);
	}
	const goToProfile = (userId) => {
		props.history.push(`/profile/${userId}`, { profile: data.candidates , id: userId});
	};

	const tableData = {
		columns: [
			{
				label: "First Name",
				field: "first_name",
				sort: "asc",
				width: 150,
			},
			{
				label: "Last Name",
				field: "last_name",
				sort: "asc",
				width: 270,
			},
			{
				label: "Job Title",
				field: "job_title",
				sort: "asc",
				width: 200,
			},
			{
				label: "Avatar",
				field: "avatar",
				sort: "asc",
				width: 100,
			},
			{
				label: "Profile",
				field: "profile",
				sort: "asc",
				width: 100,
			},
		],
		rows: rows,
	};

	return (
		<Page title="Candidates">
			<Helmet>
				<title>Candidates</title>
			</Helmet>

			<MDBDataTable striped bordered small data={tableData} />
		</Page>
	);
}
