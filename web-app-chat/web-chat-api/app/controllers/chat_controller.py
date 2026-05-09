from flask import Blueprint, request, jsonify
from app.models.database import db, Conversation, Message
from app.models.ai_model import AIModel
from app.utils.helpers import generate_conversation_id, success_response, error_response, validate_request, sanitize_input
from datetime import datetime

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/health', methods=['GET'])
def health_check():
    return success_response(message="API is healthy", data={"status": "up"})

@chat_bp.route('/chat', methods=['POST'])
@validate_request(['message'])
def chat():
    data = request.get_json()
    user_message_text = sanitize_input(data.get('message'))
    conversation_id = data.get('conversation_id')
    model_name = data.get('model', 'Kutty.AI Mini')

    try:
        # Initialize the AI Model
        # Using a dummy model configuration or mapping to actual Groq models if needed
        # We assume `AIModel` uses `GROQ_MODEL` if none is passed, or we can map UI names to Groq models:
        actual_model = "llama-3.1-8b-instant" # Use a default fast model
        ai_model = AIModel(model=actual_model)
        
        conversation = None
        if conversation_id:
            conversation = Conversation.query.get(conversation_id)
            
        if not conversation:
            # Create a new conversation
            conversation_id = generate_conversation_id()
            conversation = Conversation(id=conversation_id, title=user_message_text[:50])
            db.session.add(conversation)
            
        # Add user message
        user_message = Message(
            id=generate_conversation_id(),
            conversation_id=conversation_id,
            role='user',
            content=user_message_text,
            model='user'
        )
        db.session.add(user_message)
        
        # Get history
        messages = Message.query.filter_by(conversation_id=conversation_id).order_by(Message.timestamp.asc()).all()
        
        # Format for Groq
        history = [{"role": m.role, "content": m.content} for m in messages]
        
        # Get AI Response
        ai_response_text = ai_model.chat_with_history(history)
        
        # Add AI message
        ai_message = Message(
            id=generate_conversation_id(),
            conversation_id=conversation_id,
            role='assistant',
            content=ai_response_text,
            model=model_name
        )
        db.session.add(ai_message)
        
        # Update conversation time
        conversation.updated_at = datetime.utcnow()
        db.session.commit()
        
        return success_response(data={
            'conversation_id': conversation_id,
            'response': ai_response_text,
            'timestamp': ai_message.timestamp.isoformat() if ai_message.timestamp else datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), status_code=500)

@chat_bp.route('/conversations', methods=['GET'])
def get_conversations():
    conversations = Conversation.query.order_by(Conversation.updated_at.desc()).all()
    return success_response(data=[c.to_dict() for c in conversations])

@chat_bp.route('/conversations/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    conversation = Conversation.query.get(conversation_id)
    if not conversation:
        return error_response("Conversation not found", status_code=404)
        
    messages = Message.query.filter_by(conversation_id=conversation_id).order_by(Message.timestamp.asc()).all()
    
    data = conversation.to_dict()
    data['messages'] = [m.to_dict() for m in messages]
    
    return success_response(data=data)

@chat_bp.route('/conversations/<conversation_id>', methods=['DELETE'])
def delete_conversation(conversation_id):
    conversation = Conversation.query.get(conversation_id)
    if not conversation:
        return error_response("Conversation not found", status_code=404)
        
    db.session.delete(conversation)
    db.session.commit()
    return success_response(message="Conversation deleted")

@chat_bp.route('/conversations', methods=['DELETE'])
def clear_all_conversations():
    Conversation.query.delete()
    db.session.commit()
    return success_response(message="All conversations deleted")

@chat_bp.route('/model/info', methods=['GET'])
def model_info():
    try:
        ai_model = AIModel()
        return success_response(data=ai_model.get_model_info())
    except Exception as e:
        return error_response(str(e), status_code=500)
