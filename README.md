# Online Store Website

<p>
   An online store is a website or digital platform where businesses sell products or services to customers over the internet. It allows users to browse items, 
   add them to a virtual shopping cart, make secure payments, 
   and receive the goods or services through delivery or online access.
</p>

<p>
	The primary goal of an online store is to facilitate commercial transactions online. It bridges the gap between businesses 
	and customers by offering an 
	interactive platform where users can explore offerings, make purchases, and provide feedback.
</p> 

<p>
	It’s essentially a digital version of a physical shop, accessible 24/7, designed for convenience and a wide reach.
</p>

<p>For Online Demo : <a target="_blank" href="https://sandy-online-store.vercel.app">https://sandy-online-store.vercel.app</a></p>

# Preview

<img src="https://5an9y4lf0n50.github.io/demo-images/online-store/home.png" alt="home" />


# Features

<ol type="1">
	<li>
		Authentication
		<ol type="1">
			<li>Login</li>
			<li>Register</li>
			<li>Account Confirmation</li>
			<li>Forgot Password</li>
			<li>Reset Password</li>
		</ol>
	</li>
	<li>
		User Account
		<ol type="1">
			<li>Change Password</li>
			<li>Manage Profile</li>
		</ol>
	</li>
	<li>
		General Page
		<ol type="1">
			<li>Home</li>
			<li>Product Catalog</li>
			<li>Product Detail Page</li>
			<li>Shopping Cart</li>
			<li>Checkout Process</li>
			<li>Newslettter</li>
		</ol>
	</li>
</ol>

# Technologies Used

<ol type="1">
	<li>Visual Studio Code</li>
	<li>Modern Web Browser</li>
	<li>Git 2.4</li>
	<li>
		Backend Technologies
		<ol type="1">
			<li>MySQL 5.7 / Maria DB 11.3</li>
			<li>Node JS LTS</li>
			<li>Sails JS for REST API </li>
		</ol>
	</li>
	<li>
		Frontend Technologies
		<ol type="1">
			<li>CSS3</li>
			<li>HTML5</li>
			<li>Bootstrap 5</li>
			<li>Node JS LTS</li>
			<li>React JS</li>
		</ol>
	</li>
</ol>

## Getting Started
#### 1. Clone the repository and navigate to the directory
```shell
git clone https://github.com/sandy-andryanto/sails-online-store.git
cd sails-online-store
```

#### 2. Install backend dependencies, please move to directory sails-online-store/backend
```shell
npm install nodemon -g
npm install sails -g
npm install
```

#### 3. Make a .env file and customize its settings 
```shell
APP_ENV=development
APP_TIMEZONE=Asia/Jakarta
JWT_KEY=

DB_ADAPTER=sails-mysql
DB_DSN=mysql://db_user:db_password@db_host:db_port/db_database
```

#### 4. Start MySQL / Maria DB Service , Seed data and Running REST API
```shell
sudo service mysqld start / sudo systemctl start mariadb
CREATE DATABASE {database-name}
nodemon or sails lift
```

#### 5. Install frontend dependencies, please move to directory sails-online-store/frontend
```shell
npm install
npm run dev
```

#### 6. Make a .env.local file and customize its settings 
```shell
REACT_APP_TITLE="My Website"
REACT_APP_BACKEND_URL=http://localhost:1337
```

#### 7. Run Application 
```shell
cd frontend
npm run dev
```

#### 8. Access application by entering [https://localhost:5173](https://localhost:5173) in the browser.

<br/>
<img src="https://5an9y4lf0n50.github.io/demo-images/online-store/store.png" alt="store" />
</br>
<img src="https://5an9y4lf0n50.github.io/demo-images/online-store/product.png" alt="product" />
</br>
<img src="https://5an9y4lf0n50.github.io/demo-images/online-store/checkout.png" alt="checkout" />
</br>
<img src="https://5an9y4lf0n50.github.io/demo-images/online-store/login.png" alt="login"/>
</br>
<img src="https://5an9y4lf0n50.github.io/demo-images/online-store/register.png" alt="register" />


#### 9. Developer Contact
<ul>
	<li>
		<strong>Telegram</strong> <a target="_blank" href="https://t.me/sandy_andryanto">https://t.me/sandy_andryanto</a>
	</li>
	<li>
		<strong>Gmail</strong> <a  href="mailto:sandy.andryanto.official@gmail.com">sandy.andryanto.official@gmail.com</a>
	</li>
</ul>
