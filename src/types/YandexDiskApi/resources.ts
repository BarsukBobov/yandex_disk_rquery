export interface Resources {
    _embedded:   Embedded;
    name:        string;
    exif:        ExifClass;
    resource_id: string;
    created:     Date;
    modified:    Date;
    path:        string;
    comment_ids: ExifClass;
    type:        string;
    revision:    number;
}

export interface Embedded {
    sort:   string;
    items:  Item[];
    limit:  number;
    offset: number;
    path:   string;
    total:  number;
}

export interface Item {
    name:              string;
    exif:              Exif;
    created:           Date;
    resource_id:       string;
    modified:          string;
    path:              string;
    comment_ids:       ItemCommentIDS;
    type:              string;
    revision:          number;
    antivirus_status?: string;
    size?:             number;
    mime_type?:        string;
    sizes?:            Size[];
    file?:             string;
    media_type?:       string;
    preview?:          string;
    sha256?:           string;
    md5?:              string;
}


export interface ItemCommentIDS {
    private_resource: string;
    public_resource:  string;
}

export interface Exif {
    date_time?: Date;
}

export interface Size {
    url:  string;
    name: string;
}

export interface ExifClass {
}