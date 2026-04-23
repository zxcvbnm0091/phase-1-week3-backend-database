class AddressBookView {
  static contactView(message) {
    console.log(`[Contact Action]: ${message}`);
  }

  static GroupsView(message) {
    console.log(`[Group Action]: ${message}`);
  }

  static showView(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log("No records found.");
    } else if (Array.isArray(data)) {
      console.table(data);
    } else {
      console.log(data);
    }
  }

  static showError(err) {
    console.error(`\x1b[31m[ERROR]: ${err}\x1b[0m`);
  }
}

export default AddressBookView;
