import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useQuery, useMutation} from '@apollo/react-hooks';
import { useState } from 'react';
import gql from 'graphql-tag';

import { AuthContext } from '../../context/auth'

import "../Recommend/Recommend.css"
import Dashboard from '../Dashboard/Dashboard';

function Notifications(props){

    const { user, logout } = useContext(AuthContext);

    function logUserOut()
    {
        logout();
        props.history.push('/')
    }

    function dashboard()
    {
        props.history.push('/dashboard')
    }

    const user_id = user.id;
    const [fren_id, setfren_id] = useState('');

    const [frenaccept, { faccept }] = useMutation(FREN_ACCEPT, {
        update(_, { data: { login: userData } }){
          window.location.reload(false);
        },
        variables: {
            user_id,
            fren_id
        }
    })

    const [frenreject, { freject }] = useMutation(FREN_REJECT, {
        update(_, { data: { login: userData } }){
          window.location.reload(false);
        },
        variables: {
            user_id,
            fren_id
        }
    })

    const [meetaccept, { maccept }] = useMutation(MEET_ACCEPT, {
        update(_, { data: { login: userData } }){
          window.location.reload(false);
        },
        variables: {
            user_id,
            fren_id
        }
    })

    const [meetreject, { mreject }] = useMutation(MEET_REJECT, {
        update(_, { data: { login: userData } }){
          window.location.reload(false);
        },
        variables: {
            user_id,
            fren_id
        }
    })

    const { data } = useQuery(FETCH_NOTIFICATIONS_QUERY, {
        variables: {
            user_id
        }
    });

    async function do_frenaccept(fren_id){
        await setfren_id(fren_id);
        frenaccept();
    }

    async function do_frenreject(fren_id){
        await setfren_id(fren_id);
        frenreject();
    }

    async function do_meetaccept(fren_id){
        await setfren_id(fren_id);
        meetaccept();
    }

    async function do_meetreject(fren_id){
        await setfren_id(fren_id);
        meetreject();
    }

    var notifications = data ? data.getNotif : "";

    console.log(notifications)

    return (
            <>
            <div className="container">
                <div className="authenticate-nav">
                    <div className="a-nav-right">
                        <button className="rounded ml-2" onClick={dashboard}>DASHBOARD</button>
                        <button className="rounded ml-2 my-2" onClick={logUserOut}>LOGOUT</button>
                    </div>
                </div>

                <div className="feature-display">
                <div className="subsection-header"> Respond to your requests here!</div>
                    <div className="row">
                        {notifications && notifications.map(notification => (
                            <div className="col-lg-12">
                                <div className="friend">
                                    <div className="friend-content">
                                        <strong>Email: {notification['email']}</strong>
                                        <br />
                                        Friend Match Probability: {Math.round((notification['match'] + Number.EPSILON) * 100)/100}%
                                        <br />
                                        {notification['type'] === "friend" ? 
                                        <div>
                                            <button className="rounded ml-1 my-2" onClick={() => do_frenaccept(notification['userId'])}>ACCEPT FRIEND REQUEST</button>
                                            <button className="rounded ml-1 my-2" onClick={() => do_frenreject(notification['userId'])}>REJECT FRIEND REQUEST</button>
                                        </div>
                                        :
                                        <div>
                                            <button className="rounded ml-1 my-2" onClick={() => do_meetaccept(notification['userId'])}>ACCEPT MEET REQUEST</button>
                                            <button className="rounded ml-1 my-2" onClick={() => do_meetreject(notification['userId'])}>REJECT MEET REQUEST</button>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

const FREN_ACCEPT = gql`
    mutation frenaccept($user_id: String!, $fren_id: String!) {
        frenaccept(user_id: $user_id, fren_id: $fren_id)
    }
`;

const FREN_REJECT = gql`
    mutation frenreject($user_id: String!, $fren_id: String!) {
        frenreject(user_id: $user_id, fren_id: $fren_id)
    }
`;

const MEET_ACCEPT = gql`
    mutation meetaccept($user_id: String!, $fren_id: String!) {
        meetaccept(user_id: $user_id, fren_id: $fren_id)
    }
`;

const MEET_REJECT = gql`
    mutation meetreject($user_id: String!, $fren_id: String!) {
        meetreject(user_id: $user_id, fren_id: $fren_id)
    }
`;

const FETCH_NOTIFICATIONS_QUERY = gql`
    query($user_id: String!){
        getNotif(id: $user_id){
            userId email match type
        }
    }
`
export default Notifications;
