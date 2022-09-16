//class p procurar no github
export class GithubUser {
    static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint) //fetch busca oque eu pedir na internet, promessa.
    .then(data => data.json()) //transforma os dados em JSON

    //formas de desistruturar
    /*.then((data) => {
        //desistruturando
        //const { login, name, public_repos, followers}

        return {
            login: data.login,
            name: data.name,
            public_repos: data.public_repos,
            followers: data.followers
        }
    }) */

    //fetch retorna esse objeto
    .then(({login, name, public_repos, followers }) => 
    ({ login, name, public_repos, followers}))
}
}