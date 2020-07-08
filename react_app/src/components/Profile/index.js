import React from "react";
import Page from "../Page";
import { Card , Image } from "semantic-ui-react";
import { Helmet } from "react-helmet";

export default function Profile(props) {
    const data = props.location.state.profile[props.location.state.id - 1];
    return (
		<Page title="Profile">
			<Helmet>
				<title>Profile</title>
			</Helmet>
            
            <Card>
            <Image src={data.avatar}  />
        <Card.Content>
          <Card.Header>
            First Name: {data.first_name}
      </Card.Header>
      <Card.Header>
            Last Name: {data.last_name}
      </Card.Header>
      <Card.Meta>
            Gender: {data.gender}
          </Card.Meta>
          <Card.Meta>
            Email: {data.email}
          </Card.Meta>
          <Card.Meta>
            Job Title: {data.job_title}
          </Card.Meta>
          <Card.Description>
          Job Description: {data.job_description}
      </Card.Description>
        </Card.Content>
        
      </Card>
		</Page>
	);
}
