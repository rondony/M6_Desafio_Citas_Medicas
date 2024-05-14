import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import _ from "lodash";
import chalk from "chalk";

moment.locale('es')
const app = express()

app.listen(3001, console.log('...Los Inpacientes...'))
let users = [];

const lista = (array) => {
    let templateLista = `
    <ul>
    `
    array.forEach(user => {
        templateLista += `
        <li>Nombre: ${user.first}. Apellido: ${user.last}</li>
        <li>ID: ${user.id}</li>
        <li>TimeStamp: ${user.time}</li>
        <li>Genero: ${user.gender}</li>,       
        `
        
        console.log(chalk.bgWhite.blue(`Nombre: ${user.first}, Apellido: ${user.last}, ID: ${user.id}, TimeStamp: ${user.time}, Genero: ${user.gender}`))
    })
    templateLista += `
    </ul>`

    return templateLista;
}

const fetcher = async () => {
    app.get('/usuarios', async (req, res) => {
        const { data } = await axios.get('https://randomuser.me/api')

        const { name: { first, last }, gender } = data.results[0]

        const id = uuidv4().slice(30)

        const time = moment().format('DD-MMMM-YYYY hh:mm:ss a')

        users.push({ first, last, gender, id, time })

        const usersOrder = _.partition(users, ({ gender }) => gender == 'female');

        let template = `
        <h1>🏥Clinica DENDE🏥</h1>

        <h2>😊Lista Oficial Actualizada😊</h2>

        <h4>Total Mujeres ♀️ ${usersOrder[0].length}</h4>
            ${lista(usersOrder[0])}

        <h4>Total Hombres ♂️ ${usersOrder[1].length}</h4>
            ${lista(usersOrder[1])}        
        `
        res.send(template)
    })
}
fetcher()