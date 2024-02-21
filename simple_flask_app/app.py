# flask-login-example/app.py
from flask import Flask, render_template, request, redirect, url_for, flash, session
import json
import os

app = Flask(__name__)
app.secret_key = 'supersecretkey'

#function to load users from the json file
def load_users():
  users_path = 'users.json'
  if os.path.exists(users_path):
    with open(users_path, 'r') as f:
      users = json.load(f)
  else:
    users = {}
  return users

#function to save users to the json file in dictionary format
def save_users(users):
  users_path = 'users.json'
  with open(users_path, 'w') as f:
    json.dump(users, f)

# Function to post user to the json file
def post_user(username, password):
  users = load_users()
  users[username] = password
  save_users(users)

# Function to get user and password details from 
# the json file with specific username
def get_user(username):
  users = load_users()
  if username in users:
    return users[username]
  else:
    return None


@app.route('/')
def index():
  return render_template('login.html') # render login.html located in templates folder

@app.route('/login', methods=['POST', 'GET'])
def login():
  #if post
  if request.method == 'POST':
    username = request.form.get('username')
    password = request.form.get('password')
    user = load_users()

    if username in user and user[username] == password:
      session['username'] = username
      flash('You were successfully logged in')
      return redirect(url_for('dashboard'))
    else:
      flash('Invalid credentials', 'error')
      return redirect(url_for('index'))
  #if get
  else:
    return render_template('login.html')

@app.route('/register', methods=['POST', 'GET'])
def register():
  if request.method == 'POST':
    username = request.form.get('username')
    password = request.form.get('password')
    post_user(username, password)
    flash('You were successfully registered')
    return redirect(url_for('login'))
  else:
    return render_template('register.html')

@app.route('/dashboard')
def dashboard():
  if 'username' in session:
    username = session['username']
    return render_template('dashboard.html', username=username)
  else:
    flash('You are not logged in', 'error')
    return redirect(url_for('login'))
  
@app.route('/logout')
def logout():
  session.pop('username', None)
  flash('You were successfully logged out')
  return redirect(url_for('index'))

if __name__ == '__main__':
  app.run(debug=True)