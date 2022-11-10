# Creative Captures
Creative Captures is a online Service Review platform  where the user can add reviews of the services he/she has  availed for. For giving the reviews a user has to be logged in. After successful login one can add review of any specific service. Besides there are edit and deleted options for the reviews. There are many other features also which are described below.

This website is made by using React Router DOM, Firebase Authentication, amd Mongodb as the database. CRUD operation is the major part of this project. Besides tailwind css is used for the styling purpose. Some component libraries are also used for the design. React toastify and sweet alert is added to show the alerts for better user experience.

This is project is basically divided in two parts. 
- Client Side
- Server Side

## Made the data and Hosted in Mongodb Server

- As this is a project which needs many data regarding to the service and service details, so I have made the service data and hosted on mongodb server.
- There is one database in this project and two database collections
- serviceCollection is for the service and service details that a user can see in the website
- reviewsCollection is for the storing the data for reviews and update of the reviews.
- For deployment purpose I have hosted all the server data to vercel and add the vercel route link to get the from the client side
- As I have implemented service review system in this website and my data set (means each service is unique and has its own details).
- I have implemented CRUD operation in this website.
- JWT is one of the core purpose of this project also. It helps to secure the server side. If a user's token is not verified then he cant go on that route in clint side.



### GitHub Link (Client Side) of This Project: 
Github Link Client Side: https://github.com/Porgramming-Hero-web-course/b6a11-service-review-client-side-Fahimsakib1


### GitHub Link (Server Side) of This Project:
Github Link Server Side:  https://github.com/Porgramming-Hero-web-course/b6a11-service-review-server-side-Fahimsakib1


### Firebase Live Site Link:
Live Site Link: https://creative-captures.web.app