class Book{
    constructor(title, thumbnail, isbn, owner_name, owner_uid, owner_email){
        this.title = title;
        this.thumbnail = thumbnail;
        this.isbn = isbn;
        this.owner_name = owner_name;
        this.owner_email = owner_email;
        this.owner_uid = owner_uid;

        return this
    }
}
module.exports = Book