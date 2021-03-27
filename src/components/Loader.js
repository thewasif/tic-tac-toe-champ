const Loader = ({ visible }) => (
  <div className='loader' style={{ display: visible ? 'flex' : 'none' }}>
    <div className='lds-ripple'>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default Loader;
