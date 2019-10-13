import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Lottery from '../../ethereum/lottery';
import { Card, Grid, Button, Form, Message } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';

class LotteryShow extends Component {
  state = {
    errorMessage: '',
    loading: false
  };

  static async getInitialProps(props) {
    const lottery = Lottery(props.query.address);

    const summary = await lottery.methods.getSummary().call();

    return {
      address: props.query.address,
      contribution: summary[0],
      balance: summary[1],
      playersCount: summary[2],
      manager: summary[3]
    };
  }

  renderCards() {
    const { balance, manager, contribution, playersCount } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The manager created this lottery and can pick a random winner',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: contribution,
        meta: 'Contribution (wei)',
        description: 'You must contribute this much wei to become a player'
      },
      {
        header: playersCount,
        meta: 'Number of Players',
        description: 'Number of players that are currently in this lottery'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Lottery Balance (ether)',
        description: 'The balance is how much money the winner will take'
      }
    ];

    return <Card.Group items={items} />;
  }

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      const lottery = Lottery(this.props.address);

      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Lottery Summary</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Message
                  error
                  header="Oops!"
                  content={this.state.errorMessage}
                />
                <Button
                  primary
                  loading={this.state.loading}
                  disabled={this.state.loading}
                >
                  Pick a winner
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default LotteryShow;
