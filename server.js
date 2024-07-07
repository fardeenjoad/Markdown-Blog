const express = require('express');
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Article = require('./models/articleSchema')
const articleRouter = require('./routes/articles');
const path = require('path');
const app = express();

mongoose.connect('mongodb://localhost/blog')
    console.log('database connected')


const port = process.env.PORT || 8000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded ({ extended: false }))
app.use(methodOverride('_method'))


app.get('/', async (req, res) => {
    
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles : articles })
});

app.use('/articles', articleRouter);

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`)
});