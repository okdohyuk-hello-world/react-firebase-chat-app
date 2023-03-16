// TODO 강의자 오류로 일단 클래스 컴포넌트 사용 추후 변경
import React, { Component } from 'react';
import MessageHeader from './MessageHeader';
// import Message from './Message';
import MessageForm from './MessageForm';

export default class MainPanel extends Component {
	render() {
		return (
			<div style={{ padding: '2rem 2rem 0 2rem'}}>
				<MessageHeader />
				
				<div style={{
						width: '100%',
						height: '450px',
						border: '.2rem solid #ececec',
						borderRadius: '4px',
						padding: '1rem',
						marginBottom: '1rem',
						overflowY: 'auto'
					}}>
				</div>
				
				<MessageForm />
			</div>
		);
	};
};