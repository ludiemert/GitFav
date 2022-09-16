import { GithubUser } from "./GithubUser.js"

//aqui nesse arquivo fica so os Favoritos


//classe que vai conter a logica dos dados
//como os dados serao estruturados
//guardar os dados

//vai unir as duas com herança

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()   //carregar o load

        //retorna uma promessa
        GithubUser.search('diego3g').then(user => console.log(user))
    }

    //load para carregamento dos dados
    load() { //transforma em um array, ele inicia vazio
        this.entries = JSON.parse(localStorage.getItem
            ('@github-favorites:')) || []          
        
        /*//entradas de dados
          this.entries = //ja recebe o array
          //ter dados, será um array contendo os dados
          [//uma estrutura de array com um unico objeto
               {//vai conter informações
              login: 'maykbrito',
              name: "Mayk Brito",
              public_repos: '7777',
              followers: '234455'
              },
  
          //segundo objeto
          {//vai conter informações
              login: 'diego3g',
              name: "Diego Fernandes",
              public_repos: '9999',
              followers: '98789'
              }  
      //funcionalidade para o array. Para cada um rode uma função
      ] */

    }

    //salvar o usuario no localStorage
    save() {//vai transformar o JS em JSON  de array(entries) para string, para salvar no localstorage
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }


    //add usuario no favorito
    //função assincrona p JS
    //await sempre aguardar a promessa
    async add(username) {
        try { //try =>tente fazer isso

            //nao deixar colocar o mesmo usuario varias vezes
            //verificar se o usuario ja nao esta no entrie
            //antes de entrar no git
            const userExists = this.entries.find(entry => entry.login === username) //se o usuario existe
            //console.log(userExists)

            //ja retorna a mensagem
            if(userExists) {
                throw new Error('Usuario já cadastrado como Favorito!')
            }



            //buscar o usuario no github
        const user = await GithubUser.search(username) //await espere a promessa
         if(user.login === undefined) {
             //throw 'vomite' mande um erro
             throw new Error('Usuario não encontrado!')
         }

         
         //adicionar os usuarios e espalhando
         this.entries = [user, ...this.entries]
         this.update()  //depois de adicionar ela tem que fazer o update dos entries
         this.save() //para salvar sem perder qdo atualizar a pagina

        } //se der errado entre no catch
        //console.log(username)
        catch (error) {//catch =>capitura o erro
            alert(error.message)
        }
        
    }

    //o filter vai ter uma função para cada entrada que é o entry
    delete(user) { //principio da imutabilidade nao pode quebrar
    const filteredEntries = this.entries.filter(entry => 
        //console.log(entry) //entry de entrada
        //return false  //true coloca no array
        entry.login !== user.login)

        //console.log(filteredEntries)

        //atribuindo um novo array, sem quebrar imutabilidade
        this.entries = filteredEntries

        //update da aplicacao
        this.update()

        //para salvar no localstorage os usuarios que vc deletar
        this.save() //nao permitir que coloque mais que um o mesmo usuario
    } 

}


//classe que vua criar a visualizacao e eventos do html
//vai construir a tabela

export class FavoritesView extends Favorites { //extends uni as duas classes 
    constructor(root) {
        super(root) //esse é a cola que chama o root la de cima

         //entrar dentro da tabela
         this.tbody = this.root.querySelector('table tbody')

        //console.log(this.root)
        this.update()
        this.onadd() //ja para ele rodar no começo
    }


    //evento para add evento
    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input') //tirando dentro do input somente o value

            //console.dir(input) //mostra como um objeto
            //console.log(value)

            this.add(value)//chama o usuario
        }
    }


    //sumir e aparecer a mensagem do favorito do meio com estrela
    Half(){

    this.entries.length === 0 ? 
    document.querySelector('.half').classList.remove('sr-only') : 
    document.querySelector('.half').classList.add('sr-only')
  }
    

    //criar o HTML, sempre vai rodar o update a cada ação
    update() {

            this.Half()

           this.removeAlltr()
      
    
    //para cada usuario mostre os dados
    this.entries.forEach( user => {
        //console.log(user)
        //retornando a Row uma tr criado pela DOM
        const row = this.createRow()
        //console.log(row)

        //mudando o conteudo pela DOM
        row.querySelector('.user img').src = `https://github.com/${user.login}.png`
        row.querySelector('.user img').alt = `Imagem de ${user.name}`
        row.querySelector('.user a').href = `https://github.com/${user.login}`
        row.querySelector('.user p').textContent = user.name
        row.querySelector('.user span').textContent = user.login
        row.querySelector('.repositories').textContent = user.public_repos
        row.querySelector('.followers').textContent = user.followers

        //botao de remover. Evento onclick (pode usar somente nesse evento, se precisar usar em varios eventos use o eventlist)recebe uma função
        row.querySelector('.remove').onclick = () => {
            const isOK = confirm('Tem certeza que quer Remover essa linha?')
            if(isOK) {
                this.delete(user)
            }
        }


        //append => um elemnto da HTML, uma funcionalidade da DOM, elemento da DOM
        this.tbody.append(row)
    })
    }
    

    //criar um elemento pela DOM
    createRow() {

        //criando meu tr pela DOM
        const tr = document.createElement('tr')


        //estrutura do HTML
        tr.innerHTML = `        
        <td class="user">
          <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
          <a href="https://github.com/maykbrito" target="_blank">
            <p>Mayk Brito</p>
            <span>maykbrito</span>
          </a>
        </td>
        <td class="repositories">
          76
        </td>
        <td class="followers">
          9589
        </td>
        <td> <!--um botao com X pra escluir  <button class="Remove">&times;</button>-->
            <button class="remove">Remover</button>
        </td>
     `
        return tr

    }

    
    removeAlltr() {
           
        //console.log(tbody.querySelectorAll('tr')) //vai pegar todos os usuarios que estao na tabela
        //document.querySelectorAll('tr') => direto no console
        this.tbody.querySelectorAll('tr')
            //forEach é para cada um ela executa essa função
            .forEach((tr)  => {
               // console.log(tr) //vai mostrar cada tr
               tr.remove()  //remover da pagina
            })

    }

}
