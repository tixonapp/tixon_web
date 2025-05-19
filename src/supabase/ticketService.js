import { supabase } from './supabaseClient';

/**
 * Save ticket data using Supabase functions or direct API call
 * 
 * This approach works around permission issues by:
 * 1. Using a function if you have a serverless function setup
 * 2. Falling back to direct API with proper headers if functions aren't available
 */
export const saveTicketData = async (ticketData) => {
  try {
    // OPTION 1: Using Supabase Functions (if you have them set up)
    // Uncomment this section if you have a serverless function set up
    /*
    const { data, error } = await supabase.functions.invoke('save-ticket', {
      body: { ticketData }
    });
    
    if (error) throw error;
    return data;
    */
    
    // OPTION 2: Using a direct fetch to a custom backend (temporary solution)
    // This is a temporary solution that would require you to set up a simple backend
    // or use a service like render.com, Vercel, or Netlify functions
    const response = await fetch('https://outhserver.onrender.com/api/save-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save ticket');
    }
    
    return await response.json();
    
    // OPTION 3: Direct insert with special headers (if backend supports this)
    // This approach can work if your backend has special auth bypass for this endpoint
    /*
    const { data, error } = await supabase
      .from('user_tickets')
      .insert([ticketData])
      .select('id');
      
    if (error) {
      console.error('Insert error details:', error);
      throw new Error('Failed to save tickets: ' + error.message);
    }
    
    return data[0];
    */
  } catch (error) {
    console.error('Error saving ticket:', error);
    throw error;
  }
};

/**
 * Get ticket by payment ID
 */
export const getTicketByPaymentId = async (paymentId) => {
  try {
    // This should be public readable
    const { data, error } = await supabase
      .from('user_tickets')
      .select('*')
      .eq('payment_id', paymentId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
}; 