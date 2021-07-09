import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from '../../pages/Home'
import Edit from '../../pages/Edit'

function MainRoute() {
    return (
        <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/edit/:id' component={Edit} />
      </Switch>
    </Router>
    )
}

export default MainRoute
