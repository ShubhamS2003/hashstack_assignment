
# Node.js with Web3 Assignment (HashStack)

Write a node.js server that acts as a backend to Etherscan. The server must provide the following details:

1. Latest block.
2. Details of last ‘n’ blocks.
3. Account details of a particular address, i.e., eth balance, last ‘n’ transactions, etc.
4. Details of different ERC20 tokens provided their addresses.
5. All these details must be fetched from the Ethereum mainnet.
6. Whenever the server is started it must fetch the last 100 block details and store it in mongodb. After that whenever a new block is created that data must be added automatically to the database.
7. If the value of ‘n’ in the 2nd requirement doesn’t exceed the number of blocks stored already in the database, the data should be fetched from the database itself.
Optional: Dockerize the entire server so that it can be run on any platform with the docker compose-up command.





## API Reference

#### Get latest blocks

```http
  GET /api/v1/blocks/latest_block
```
#### Get 'n' latest blocks

```http
  GET /api/v1/blocks/n_latest_block
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| n | 'int' | **Required** number of blocks to fetch |

#### Get Account Information

```http
  GET /api/v1/accounts/account_info/${address}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `address`      | `string` | **Required** Address of the account|

#### Get ERC-20 Token Information

```http
  GET /api/v1/tokens/token_info/${address}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `address`      | `string` | **Required** Contract address of the token|




## Deployment

To deploy this project run

```bash
  git clone https://github.com/ShubhamS2003/hashstack_assignment.git
```

Go to the server directory

```bash
  cd/hashstack_assignment/server
```

Run the server

```bash
  node app.js
```

## Postman

[Workspace](https://www.postman.com/shubhams2003/workspace/hashstack-assignment-apis)



