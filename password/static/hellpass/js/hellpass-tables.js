$( document ).ready(function() {
    var table = $('#hellpass-table').DataTable({
        dom: 'l<"toolbar">frtip',
        processing: false,
        serverSide: true,
        searching: true,
        sorting: true,
        paging: true,
        info: false,
        ajax: {
            processing: true,
            url: "/api",
            dataSrc: "data",
            type: "POST",
            data: {
                // Attach CSRF token to POST, because we are not using a form  
                csrfmiddlewaretoken: $('#global-csrftoken > [name=csrfmiddlewaretoken]').attr('value'),
            }, 
        },
        language: {
            "emptyTable": "No passwords to display.",
        },
        columns: 
        [
            {
                "data": "pk",
                "searchable": false,
                render: function ( value, type, row ) {
                    return `
                        <input class="form-control" style="width: 50px;" type="text" value="${row.pk}" name="pws" readonly> 
                        `
                },
            },
            {
                "data": "name",
                "searchable": true,
                render: function ( value, type, row ) {
                    return `
                        <input class="form-control" type="text" value="${value}" name="name-${row.pk}"> 
                        `
                },
            },
            {
                "data": "url",
                "searchable": true,
                render: function ( value, type, row ) {
                    return `
                        <input class="form-control" type="text" value="${value}" name="url-${row.pk}"> 
                        `
                },
            },
            { 
                "data": "username", 
                "searchable": true,
                render: function ( value, type, row ) {
                    return `
                        <input class="form-control" type="text" value="${value}" name="username-${row.pk}"> 
                        `
                },
            },
            { 
                "data": "password", 
                "searchable": false,
                render: function ( value, type, row ) {
                    return `
                        <input class="form-control" type="password" value="${value}" name="password-${row.pk}" id="password-${row.pk}">  
                        `
                },
            },
            { 
                "data": "expires", 
                "searchable": false,
                render: function ( value, type, row ) {
                    if (!value) {
                        value = 'Never'
                    };
                    return `
                        <input class="form-control" type="text" value="${value}" name="expires-${row.pk}" id="expires-${row.pk}" readonly>  
                        `
                },
            },
            {
                render: function (value, type, row) {
                    return `<button type="button" data-pk="${row.pk}" class="btn btn-info settings-btn glyphicon glyphicon-cog"></button><button type="button" data-pk="${row.pk}" class="btn btn-warning showpass-btn glyphicon glyphicon-eye-open" id="toggle-${row.pk}"></button><button type="button" data-pk="${row.pk}" class="btn btn-danger delete-btn glyphicon glyphicon-trash"></button>`
                }
            },
            
        ],
        drawCallback: function () {
            // Event listeners for action buttons
            $('#hellpass-new').unbind().click(function() {
                console.log('New')
                newPassword();
            });
            $('#hellpass-save').on('click', function(){
                saveForm();
            });
            $('.delete-btn').on('click', function(){
                console.log('Delete')
                deletePassword($(this).data('pk'));
            });
            $('.showpass-btn').on('click', function(){
                console.log('Show')
                showPassword($(this).data('pk'));
            });
            $('.settings-btn').on('click', function(){
                console.log('Settings')
                modal_html = modalParser($(this).data('pk'));
                showSettings(modal_html);
            });
        },
        rowCallback: function( row, data ) {
            console.log(row)
        },
    });
    // Saves changes made to password-table
    var saveForm = function () {
        // Retrieve form data for AJAX call
        var form_data = $('#hellpass-form').serializeArray();
        form_data.push({
            name: 'csrfmiddlewaretoken',
            value: $('#global-csrftoken > [name=csrfmiddlewaretoken]').attr('value'),
          }, {
              name: 'save_form',
              value: true,
          });
            // Submit updated passwords to Django
            $.ajax({
                url: '/api/edit',
                data: form_data,      
                type: 'POST', 
                dataType: 'json',
                // Ajax call was sucessful, update Save buttton
                success: function (data) {
                    if (data.saved_form) {
                        btn_save = document.getElementById('hellpass-save');
                        btn_save.disabled = true;
                        btn_save.innerHTML = 'Saved';
                    };
                }
            });
    };
    // Enable save function
    var enableSave =  function () {
        btn_save = document.getElementById('hellpass-save');
        btn_save.disabled = false;
        btn_save.innerHTML = 'Save';
        console.log("Form has changed!");
    };
    // Create new password
    var newPassword = function () {
        console.log('Creating new password')
        var form = $('#hellpass-form');
        $.ajax({
            url: '/api/edit',      
            type: 'POST',
            data: {
                new_password: true,
                // Attach CSRF token to POST, because we are not using a form  
                csrfmiddlewaretoken: $('#global-csrftoken > [name=csrfmiddlewaretoken]').attr('value'),
            }, 
            dataType: 'json',
            // Ajax call was sucessful, update Save buttton
            success: function (data) {
                if (data.new_password) {
                    table.draw();
                };
            }
        });
    };
    // Delete Password
    var deletePassword = function (password_pk) {
        var form = $('#hellpass-form');
        $.ajax({
            url: '/api/edit',    
            type: 'POST',
            data: {
                // Attach CSRF token to POST, because we are not using a form  
                delete_password: password_pk,
                csrfmiddlewaretoken: $('#global-csrftoken > [name=csrfmiddlewaretoken]').attr('value'),
            }, 
            dataType: 'json',
            // Ajax call was sucessful, update Save buttton
            success: function (data) {
                if (data.delete_password) {
                    table.draw();
                };
            }
        });
    };
    // Show Password
    var showPassword = function (password_pk) {
        if ($(`#toggle-${password_pk}`).hasClass('glyphicon-eye-open')) {
            $(`#password-${password_pk}`).prop('type', 'text');
            $(`#toggle-${password_pk}`).removeClass('glyphicon-eye-open')
            $(`#toggle-${password_pk}`).addClass('glyphicon-eye-close')
        } else {
            $(`#toggle-${password_pk}`).removeClass('glyphicon-eye-close')
            $(`#toggle-${password_pk}`).addClass('glyphicon-eye-open')
            $(`#password-${password_pk}`).prop('type', 'password');
        }
        
    };
    var modalParser = function (password_pk) {
        name = $(`input[name=name-${password_pk}]`).val()
        url = $(`input[name=url-${password_pk}]`).val()

        modal_html = `
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title">${password_pk} - ${name}</h4>
            </div>
            <div class="modal-body" id="modal-body">
                <span style="font-size: 1.25em;">
                    Set the password rotation for ${url}
                </span>
                <select name="expires" class="form-control">
                    <option value="1">Every month</option>
                    <option value="3">Every 3 months</option>
                    <option value="6">Every 6 Months</option>
                    <option value="0">Never</option>
                </select>
            </div>
            <div class="modal-footer">
                <button id="modal-save" data-pk="${password_pk}" class="btn btn-success">Save</span></button>
            </div>
        `
        return modal_html
    };
    var updateExpires = function (password_pk, expires) {
        if (expires == 0) {
            new_expiration = 'Never'
        } else {
            new_expiration = moment(moment()).add(expires, 'M').format('YYYY-MM-DD');
        }
        $(`input[name=expires-${password_pk}]`).val(new_expiration)
        $("#modal-settings").modal("hide");
        saveForm();
    };
    var showSettings = function (modal_html) {
        $("#modal-settings .modal-content").html(modal_html);
        $("#modal-settings").modal("show");
        $('#modal-save').on('click', function(){
            console.log('Modal save')
            expires = $(`select[name=expires]`).val()
            password_pk = $(this).data('pk')
            updateExpires(password_pk, expires)
        });
    };
    // Event listner for table input, enables save button when changes are made
    $('#hellpass-form').on('input', function(event){
        event.preventDefault();
        console.log("New question received, making AJAX call to Django")  
        enableSave();
    });
    // Populate datatables toolbar div with new/save buttons
    $("div.toolbar").html(`<div style="float:left; margin-left: 15px; margin-bottom: 15px;">
        <button class="btn btn-info" type="button" id="hellpass-new">New</button>
        <button class="btn btn-success" type="button" id="hellpass-save" disabled>Saved</button>
        </div>`
    );
});